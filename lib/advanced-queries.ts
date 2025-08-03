// This file contains the advanced SQL queries and stored procedures for the flight delay prediction system

export const WEATHER_IMPACT_QUERY = `
SELECT  
    we.type AS weather_type, 
    we.severity AS weather_severity, 
    CASE  
        WHEN SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 1 THEN 'Within 70 miles' 
        WHEN SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 2 THEN '70-140 miles'  
        WHEN SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 3 THEN '140-210 miles' 
        ELSE 'Over 210 miles'  
    END AS distance_category,
    COUNT(fs.statusId) AS affected_flights, 
    ROUND(AVG(fs.departureDelay), 2) AS avg_departure_delay, 
    ROUND(AVG(fs.arrivalDelay), 2) AS avg_arrival_delay, 
    SUM(fs.cancelled) AS cancelled_flights 
FROM  
    Weather_Event we 
JOIN 
    Airport a ON SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 5
JOIN 
    Flight f ON f.originAirport = a.airportCode
JOIN 
    Flight_Status fs ON f.flightId = fs.flightId AND DATE(fs.flightDate) = DATE(we.startTime)
WHERE  
    fs.departureDelay > 0 OR fs.cancelled = 1 
GROUP BY  
    we.type, we.severity, distance_category 
ORDER BY  
    weather_type, weather_severity, distance_category
`

export const TEMPORAL_ANALYSIS_QUERY = `
SELECT  
    HOUR(f.scheduledDepartureTime) AS departure_hour, 
    COUNT(fs.statusId) AS total_flights, 
    ROUND(AVG(fs.departureDelay), 2) AS avg_departure_delay, 
    ROUND(100.0 * SUM(CASE WHEN fs.carrierDelay > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS carrier_delay_pct, 
    ROUND(100.0 * SUM(CASE WHEN fs.weatherDelay > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS weather_delay_pct, 
    ROUND(100.0 * SUM(CASE WHEN fs.nasDelay > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS nas_delay_pct, 
    ROUND(100.0 * SUM(CASE WHEN fs.securityDelay > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS security_delay_pct, 
    ROUND(100.0 * SUM(CASE WHEN fs.lateAircraftDelay > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS late_aircraft_delay_pct, 
    ROUND(AVG(CASE WHEN fs.weatherDelay > 0 THEN fs.weatherDelay ELSE NULL END), 2) AS avg_weather_delay_mins, 
    COUNT(CASE WHEN EXISTS (
        SELECT 1 FROM Weather_Event we  
        WHERE SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 2 
        AND DATE(f.scheduledDepartureTime) = DATE(we.startTime) 
    ) THEN 1 ELSE NULL END) AS flights_near_weather 
FROM  
    Flight f 
JOIN  
    Flight_Status fs ON f.flightId = fs.flightId 
JOIN  
    Airport a ON f.originAirport = a.airportCode 
WHERE  
    fs.departureDelay > 0 
GROUP BY  
    departure_hour 
ORDER BY  
    departure_hour
`

export const AIRLINE_PERFORMANCE_QUERY = `
SELECT  
    al.name AS airline_name, 
    (SELECT ROUND(AVG(fs.departureDelay), 2) 
     FROM Flight f 
     JOIN Flight_Status fs ON f.flightId = fs.flightId 
     WHERE f.airlineCode = al.airlineCode 
     AND NOT EXISTS (
         SELECT 1 FROM Weather_Event we 
         JOIN Airport a ON f.originAirport = a.airportCode 
         WHERE DATE(fs.flightDate) = DATE(we.startTime) 
         AND SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 3 
     )) AS avg_delay_normal, 
     
    (SELECT ROUND(AVG(fs.departureDelay), 2) 
     FROM Flight f 
     JOIN Flight_Status fs ON f.flightId = fs.flightId 
     JOIN Airport a ON f.originAirport = a.airportCode 
     JOIN Weather_Event we ON DATE(fs.flightDate) = DATE(we.startTime) 
     WHERE f.airlineCode = al.airlineCode 
     AND SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 3 
    ) AS avg_delay_weather,   
     
    (SELECT COALESCE(avg_delay_weather, 0) - COALESCE(avg_delay_normal, 0)) AS delay_difference, 
     
    ROUND(100.0 * COALESCE(
     (SELECT SUM(fs.cancelled) FROM Flight f 
      JOIN Flight_Status fs ON f.flightId = fs.flightId 
      JOIN Airport a ON f.originAirport = a.airportCode 
      JOIN Weather_Event we ON DATE(fs.flightDate) = DATE(we.startTime) 
      WHERE f.airlineCode = al.airlineCode 
      AND SQRT(POW(a.locationLat - we.locationLat, 2) + POW(a.locationLng - we.locationLng, 2)) <= 3 
     ), 0) /  
     NULLIF((SELECT COUNT(*) FROM Flight f WHERE f.airlineCode = al.airlineCode), 0), 2) AS cancellation_pct_weather, 
     
    (SELECT COUNT(*) FROM Flight f WHERE f.airlineCode = al.airlineCode) AS total_flights 
FROM  
    Airline al 
WHERE 
    EXISTS (SELECT 1 FROM Flight f WHERE f.airlineCode = al.airlineCode) 
ORDER BY  
    delay_difference DESC
`

// Stored procedure for getting delayed flights with detailed information
export const CREATE_GET_DELAYED_FLIGHTS_PROCEDURE = `
CREATE PROCEDURE GetDelayedFlights(
    IN p_threshold INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_airline_code VARCHAR(10),
    IN p_max_results INT
)
BEGIN
    -- Set default values if parameters are NULL
    SET p_threshold = IFNULL(p_threshold, 15);
    SET p_max_results = IFNULL(p_max_results, 100);
    
    -- First result set: Detailed flight information
    SELECT 
        f.flightId,
        f.airlineCode,
        f.flightNumber,
        al.name AS airline_name,
        f.originAirport,
        orig.name AS origin_name,
        orig.city AS origin_city,
        f.destAirport,
        dest.name AS dest_name,
        dest.city AS dest_city,
        fs.flightDate,
        f.scheduledDepartureTime,
        f.scheduledArrivalTime,
        fs.actualDepartureTime,
        fs.actualArrivalTime,
        fs.departureDelay,
        fs.arrivalDelay,
        CASE 
            WHEN fs.cancelled = 1 THEN 'Cancelled'
            WHEN fs.diverted = 1 THEN 'Diverted'
            WHEN fs.departureDelay > p_threshold THEN 'Delayed'
            ELSE 'On Time'
        END AS flight_status,
        CASE
            WHEN fs.weatherDelay > 0 THEN 'Weather'
            WHEN fs.carrierDelay > 0 THEN 'Carrier'
            WHEN fs.nasDelay > 0 THEN 'Air Traffic'
            WHEN fs.securityDelay > 0 THEN 'Security'
            WHEN fs.lateAircraftDelay > 0 THEN 'Late Aircraft'
            ELSE 'Unknown'
        END AS delay_reason,
        GREATEST(
            COALESCE(fs.weatherDelay, 0),
            COALESCE(fs.carrierDelay, 0),
            COALESCE(fs.nasDelay, 0),
            COALESCE(fs.securityDelay, 0),
            COALESCE(fs.lateAircraftDelay, 0)
        ) AS primary_delay_minutes
    FROM 
        Flight f
    JOIN 
        Flight_Status fs ON f.flightId = fs.flightId
    JOIN 
        Airline al ON f.airlineCode = al.airlineCode
    JOIN 
        Airport orig ON f.originAirport = orig.airportCode
    JOIN 
        Airport dest ON f.destAirport = dest.airportCode
    WHERE 
        (fs.departureDelay > p_threshold OR fs.cancelled = 1)
        AND (p_start_date IS NULL OR fs.flightDate >= p_start_date)
        AND (p_end_date IS NULL OR fs.flightDate <= p_end_date)
        AND (p_airline_code IS NULL OR f.airlineCode = p_airline_code)
    ORDER BY 
        fs.departureDelay DESC
    LIMIT p_max_results;
    
    -- Second result set: Summary statistics
    SELECT 
        COUNT(*) AS total_delayed_flights,
        SUM(fs.cancelled) AS cancelled_flights,
        SUM(fs.diverted) AS diverted_flights,
        ROUND(AVG(fs.departureDelay), 2) AS avg_departure_delay,
        ROUND(AVG(fs.arrivalDelay), 2) AS avg_arrival_delay,
        ROUND(AVG(CASE WHEN fs.carrierDelay > 0 THEN fs.carrierDelay ELSE NULL END), 2) AS avg_carrier_delay,
        ROUND(AVG(CASE WHEN fs.weatherDelay > 0 THEN fs.weatherDelay ELSE NULL END), 2) AS avg_weather_delay,
        ROUND(AVG(CASE WHEN fs.nasDelay > 0 THEN fs.nasDelay ELSE NULL END), 2) AS avg_nas_delay
    FROM 
        Flight f
    JOIN 
        Flight_Status fs ON f.flightId = fs.flightId
    WHERE 
        (fs.departureDelay > p_threshold OR fs.cancelled = 1)
        AND (p_start_date IS NULL OR fs.flightDate >= p_start_date)
        AND (p_end_date IS NULL OR fs.flightDate <= p_end_date)
        AND (p_airline_code IS NULL OR f.airlineCode = p_airline_code);
END
`

// Transaction for updating flight status with prediction
export const UPDATE_FLIGHT_STATUS_TRANSACTION = `
CREATE PROCEDURE UpdateFlightStatusWithPrediction(
    IN p_flight_id VARCHAR(36),
    IN p_status_id VARCHAR(36),
    IN p_departure_delay FLOAT,
    IN p_arrival_delay FLOAT,
    IN p_cancelled BOOLEAN,
    IN p_weather_delay FLOAT,
    IN p_carrier_delay FLOAT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- Start transaction with REPEATABLE READ isolation level
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    START TRANSACTION;
    
    -- Update flight status
    UPDATE Flight_Status
    SET 
        departureDelay = p_departure_delay,
        arrivalDelay = p_arrival_delay,
        cancelled = p_cancelled,
        weatherDelay = p_weather_delay,
        carrierDelay = p_carrier_delay,
        actualDepartureTime = CASE 
            WHEN p_departure_delay IS NOT NULL AND p_cancelled = 0 THEN 
                (SELECT DATE_ADD(scheduledDepartureTime, INTERVAL p_departure_delay MINUTE) 
                 FROM Flight WHERE flightId = p_flight_id)
            ELSE NULL
        END,
        actualArrivalTime = CASE 
            WHEN p_arrival_delay IS NOT NULL AND p_cancelled = 0 THEN 
                (SELECT DATE_ADD(scheduledArrivalTime, INTERVAL p_arrival_delay MINUTE) 
                 FROM Flight WHERE flightId = p_flight_id)
            ELSE NULL
        END
    WHERE statusId = p_status_id;
    
    -- Create a delay prediction if delay is significant
    IF (p_departure_delay > 15 OR p_arrival_delay > 15) AND p_cancelled = 0 THEN
        INSERT INTO Delay_Prediction (
            predictionId, 
            flightId, 
            predictionTime, 
            predictedDepartureDelay, 
            predictedArrivalDelay, 
            notificationSent, 
            predictionReason
        )
        VALUES (
            UUID(), 
            p_flight_id, 
            NOW(), 
            p_departure_delay * 1.1, 
            p_arrival_delay * 1.1, 
            FALSE, 
            CASE 
                WHEN p_weather_delay > 0 THEN 'Weather delay predicted to increase'
                WHEN p_carrier_delay > 0 THEN 'Carrier delay predicted to increase'
                ELSE 'General delay predicted to increase'
            END
        );
    END IF;
    
    COMMIT;
END
`

// Trigger for automatically creating a delay prediction when a flight status is updated with a delay
export const AFTER_FLIGHT_STATUS_UPDATE_TRIGGER = `
CREATE TRIGGER after_flight_status_update
AFTER UPDATE ON Flight_Status
FOR EACH ROW
BEGIN
    IF (NEW.departureDelay > 0 OR NEW.arrivalDelay > 0) AND 
       (OLD.departureDelay <> NEW.departureDelay OR OLD.arrivalDelay <> NEW.arrivalDelay) THEN
        INSERT INTO Delay_Prediction (
            predictionId, 
            flightId, 
            predictionTime, 
            predictedDepartureDelay, 
            predictedArrivalDelay, 
            notificationSent, 
            predictionReason
        ) 
        VALUES (
            UUID(), 
            NEW.flightId, 
            NOW(), 
            NEW.departureDelay * 1.1, 
            NEW.arrivalDelay * 1.1, 
            FALSE, 
            'Auto-generated from status update'
        );
    END IF;
END
`

// Add this at the end of the file, after the existing stored procedures and triggers

export const CREATE_ROUTE_DELAY_ANALYSIS_PROCEDURE = `
CREATE PROCEDURE GetRouteDelayAnalysis()
BEGIN
    SELECT 
        f.originAirport,
        orig.name AS origin_name,
        f.destAirport,
        dest.name AS dest_name,
        COUNT(fs.statusId) AS total_flights,
        ROUND(AVG(fs.departureDelay), 2) AS avg_departure_delay,
        ROUND(AVG(fs.arrivalDelay), 2) AS avg_arrival_delay,
        SUM(fs.cancelled) AS cancelled_flights,
        ROUND(AVG(f.distance), 0) AS avg_distance,
        ROUND(
            (AVG(fs.departureDelay) + AVG(fs.arrivalDelay)) / 
            NULLIF(AVG(f.distance), 0) * 100, 
            2
        ) AS delay_per_100_miles
    FROM 
        Flight f
    JOIN 
        Flight_Status fs ON f.flightId = fs.flightId
    JOIN 
        Airport orig ON f.originAirport = orig.airportCode
    JOIN 
        Airport dest ON f.destAirport = dest.airportCode
    GROUP BY 
        f.originAirport, f.destAirport
    HAVING 
        total_flights >= 5
    ORDER BY 
        delay_per_100_miles DESC
    LIMIT 20;
END
`
