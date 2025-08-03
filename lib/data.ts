"use server"

import type { Flight, FlightStatus, Airline, Airport } from "./types"
import { db } from "./lib/db"
import { WEATHER_IMPACT_QUERY, TEMPORAL_ANALYSIS_QUERY, AIRLINE_PERFORMANCE_QUERY } from "./advanced-queries"

// Flight CRUD operations
export async function getFlights(): Promise<Flight[]> {
  try {
    return await db.query<Flight>(`
      SELECT * FROM Flight
      ORDER BY scheduledDepartureTime DESC
      LIMIT 100
    `)
  } catch (error) {
    console.error("Error fetching flights:", error)
    return []
  }
}

export async function getFlight(flightId: string): Promise<Flight | null> {
  try {
    const flights = await db.query<Flight>(
      `
      SELECT * FROM Flight
      WHERE flightId = ?
    `,
      [flightId],
    )

    return flights.length > 0 ? flights[0] : null
  } catch (error) {
    console.error("Error fetching flight:", error)
    return null
  }
}

export async function createFlight(flightData: Omit<Flight, "flightId">): Promise<Flight | null> {
  try {
    const flightId = crypto.randomUUID()

    await db.execute(
      `
      INSERT INTO Flight (
        flightId, airlineCode, flightNumber, originAirport, destAirport,
        scheduledDepartureTime, scheduledArrivalTime, elapsedTime, distance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        flightId,
        flightData.airlineCode,
        flightData.flightNumber,
        flightData.originAirport,
        flightData.destAirport,
        flightData.scheduledDepartureTime,
        flightData.scheduledArrivalTime,
        flightData.elapsedTime || null,
        flightData.distance || null,
      ],
    )

    return { flightId, ...flightData }
  } catch (error) {
    console.error("Error creating flight:", error)
    return null
  }
}

export async function updateFlight(flightId: string, flightData: Partial<Flight>): Promise<boolean> {
  try {
    const setClauses = Object.entries(flightData)
      .filter(([key]) => key !== "flightId")
      .map(([key]) => `${key} = ?`)
      .join(", ")

    const values = Object.entries(flightData)
      .filter(([key]) => key !== "flightId")
      .map(([_, value]) => value)

    await db.execute(
      `
      UPDATE Flight
      SET ${setClauses}
      WHERE flightId = ?
    `,
      [...values, flightId],
    )

    return true
  } catch (error) {
    console.error("Error updating flight:", error)
    return false
  }
}

export async function deleteFlight(flightId: string): Promise<boolean> {
  try {
    // First delete any related records in Flight_Status
    await db.execute(
      `
      DELETE FROM Flight_Status
      WHERE flightId = ?
    `,
      [flightId],
    )

    // Then delete any related records in Delay_Prediction
    await db.execute(
      `
      DELETE FROM Delay_Prediction
      WHERE flightId = ?
    `,
      [flightId],
    )

    // Finally delete the flight
    await db.execute(
      `
      DELETE FROM Flight
      WHERE flightId = ?
    `,
      [flightId],
    )

    return true
  } catch (error) {
    console.error("Error deleting flight:", error)
    return false
  }
}

// Flight Status operations
export async function getFlightStatuses(): Promise<FlightStatus[]> {
  try {
    const statuses = await db.query<any>(`
      SELECT fs.*, f.airlineCode, f.flightNumber, f.originAirport, f.destAirport, 
             f.scheduledDepartureTime, f.scheduledArrivalTime
      FROM Flight_Status fs
      JOIN Flight f ON fs.flightId = f.flightId
      ORDER BY fs.flightDate DESC
      LIMIT 20
    `)

    // Transform the flat result into the expected structure with nested flight object
    return statuses.map((status) => ({
      ...status,
      flight: {
        flightId: status.flightId,
        airlineCode: status.airlineCode,
        flightNumber: status.flightNumber,
        originAirport: status.originAirport,
        destAirport: status.destAirport,
        scheduledDepartureTime: status.scheduledDepartureTime,
        scheduledArrivalTime: status.scheduledArrivalTime,
      },
    }))
  } catch (error) {
    console.error("Error fetching flight statuses:", error)
    return []
  }
}

// Search operations
export async function searchFlights(query: string): Promise<Flight[]> {
  try {
    // Parse the flight number if it matches the pattern of airline code + number
    const flightNumberMatch = query.match(/^([A-Z]{2})(\d+)$/i)

    if (flightNumberMatch) {
      const airlineCode = flightNumberMatch[1].toUpperCase()
      const flightNumber = Number.parseInt(flightNumberMatch[2], 10)

      return await db.query<Flight>(
        `
        SELECT f.*, a.name as airlineName
        FROM Flight f
        JOIN Airline a ON f.airlineCode = a.airlineCode
        WHERE f.airlineCode = ? AND f.flightNumber = ?
        ORDER BY f.scheduledDepartureTime DESC
        LIMIT 20
        `,
        [airlineCode, flightNumber],
      )
    }

    // If it doesn't match the pattern, perform a more general search
    return await db.query<Flight>(
      `
      SELECT f.*, a.name as airlineName
      FROM Flight f
      JOIN Airline a ON f.airlineCode = a.airlineCode
      WHERE f.flightId LIKE ?
         OR f.airlineCode LIKE ?
         OR CAST(f.flightNumber AS CHAR) LIKE ?
         OR f.originAirport LIKE ?
         OR f.destAirport LIKE ?
         OR a.name LIKE ?
      ORDER BY f.scheduledDepartureTime DESC
      LIMIT 20
      `,
      Array(6).fill(`%${query}%`),
    )
  } catch (error) {
    console.error("Error searching flights:", error)
    return []
  }
}

// Get flight with status
export async function getFlightWithStatus(airlineCode: string, flightNumber: number): Promise<any | null> {
  try {
    const results = await db.query(
      `
      SELECT 
        f.flightId, f.airlineCode, f.flightNumber, f.originAirport, f.destAirport,
        f.scheduledDepartureTime, f.scheduledArrivalTime, f.elapsedTime, f.distance,
        a.name as airlineName,
        orig.name as originAirportName, orig.city as originCity, orig.state as originState,
        dest.name as destAirportName, dest.city as destCity, dest.state as destState,
        fs.statusId, fs.flightDate, fs.actualDepartureTime, fs.actualArrivalTime,
        fs.departureDelay, fs.arrivalDelay, fs.cancelled, fs.diverted,
        fs.weatherDelay, fs.carrierDelay, fs.nasDelay, fs.securityDelay, fs.lateAircraftDelay,
        dp.predictionId, dp.predictedDepartureDelay, dp.predictedArrivalDelay, dp.predictionReason
      FROM Flight f
      JOIN Airline a ON f.airlineCode = a.airlineCode
      JOIN Airport orig ON f.originAirport = orig.airportCode
      JOIN Airport dest ON f.destAirport = dest.airportCode
      LEFT JOIN Flight_Status fs ON f.flightId = fs.flightId
      LEFT JOIN Delay_Prediction dp ON f.flightId = dp.flightId
      WHERE f.airlineCode = ? AND f.flightNumber = ?
      ORDER BY f.scheduledDepartureTime DESC
      LIMIT 1
      `,
      [airlineCode, flightNumber],
    )

    if (results.length === 0) {
      return null
    }

    return results[0]
  } catch (error) {
    console.error("Error fetching flight with status:", error)
    return null
  }
}

export async function searchAirlines(query: string): Promise<Airline[]> {
  try {
    return await db.query<Airline>(
      `
      SELECT *
      FROM Airline
      WHERE airlineCode LIKE ?
         OR name LIKE ?
         OR CAST(dotCode AS CHAR) LIKE ?
      LIMIT 20
    `,
      Array(3).fill(`%${query}%`),
    )
  } catch (error) {
    console.error("Error searching airlines:", error)
    return []
  }
}

export async function searchAirports(query: string): Promise<Airport[]> {
  try {
    return await db.query<Airport>(
      `
      SELECT *
      FROM Airport
      WHERE airportCode LIKE ?
         OR name LIKE ?
         OR city LIKE ?
         OR state LIKE ?
      LIMIT 20
    `,
      Array(4).fill(`%${query}%`),
    )
  } catch (error) {
    console.error("Error searching airports:", error)
    return []
  }
}

// Reference data
export async function getAirlines(): Promise<Airline[]> {
  try {
    return await db.query<Airline>(`
      SELECT * FROM Airline
      ORDER BY name
    `)
  } catch (error) {
    console.error("Error fetching airlines:", error)
    return []
  }
}

export async function getAirports(): Promise<Airport[]> {
  try {
    return await db.query<Airport>(`
      SELECT * FROM Airport
      ORDER BY name
    `)
  } catch (error) {
    console.error("Error fetching airports:", error)
    return []
  }
}

// Advanced database features
export async function executeStoredProcedure(procedureName: string, params: Record<string, any>): Promise<any[]> {
  try {
    const paramNames = Object.keys(params)
    const paramPlaceholders = paramNames.map(() => "?").join(", ")
    const paramValues = Object.values(params)

    // For stored procedures that return multiple result sets
    if (procedureName === "GetDelayedFlights") {
      const connection = await pool.getConnection()
      try {
        const [results] = await connection.query(`CALL ${procedureName}(${paramPlaceholders})`, paramValues)
        return results as any[]
      } finally {
        connection.release()
      }
    }

    // For regular stored procedures
    return await db.query(`CALL ${procedureName}(${paramPlaceholders})`, paramValues)
  } catch (error) {
    console.error(`Error executing stored procedure ${procedureName}:`, error)
    throw error
  }
}

export async function executeTransaction(transactionName: string, params: Record<string, any>): Promise<any> {
  try {
    const paramNames = Object.keys(params)
    const paramPlaceholders = paramNames.map(() => "?").join(", ")
    const paramValues = Object.values(params)

    return await db.transaction(
      `
      CALL ${transactionName}(${paramPlaceholders})
    `,
      paramValues,
    )
  } catch (error) {
    console.error(`Error executing transaction ${transactionName}:`, error)
    throw error
  }
}

// Advanced queries
export async function getWeatherImpactAnalysis(): Promise<any[]> {
  try {
    return await db.query(WEATHER_IMPACT_QUERY)
  } catch (error) {
    console.error("Error executing weather impact analysis:", error)
    return []
  }
}

export async function getTemporalAnalysis(): Promise<any[]> {
  try {
    return await db.query(TEMPORAL_ANALYSIS_QUERY)
  } catch (error) {
    console.error("Error executing temporal analysis:", error)
    return []
  }
}

export async function getAirlinePerformanceComparison(): Promise<any[]> {
  try {
    return await db.query(AIRLINE_PERFORMANCE_QUERY)
  } catch (error) {
    console.error("Error executing airline performance comparison:", error)
    return []
  }
}
