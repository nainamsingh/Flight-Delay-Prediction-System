"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plane, Clock, Calendar, MapPin, AlertTriangle } from "lucide-react"
import { getFlightWithStatus } from "@/lib/data"

interface FlightSearchResultProps {
  airlineCode: string
  flightNumber: number
}

export function FlightSearchResult({ airlineCode, flightNumber }: FlightSearchResultProps) {
  const [flightData, setFlightData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFlightData() {
      try {
        setLoading(true)
        const data = await getFlightWithStatus(airlineCode, flightNumber)
        setFlightData(data)
        if (!data) {
          setError(`No flight found matching ${airlineCode}${flightNumber}`)
        }
      } catch (err) {
        console.error("Error fetching flight data:", err)
        setError("An error occurred while fetching flight data")
      } finally {
        setLoading(false)
      }
    }

    fetchFlightData()
  }, [airlineCode, flightNumber])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error || !flightData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Flight Not Found</h3>
        <p className="text-muted-foreground">{error || "No flight information available"}</p>
      </div>
    )
  }

  // Determine flight status
  let status = "On Time"
  let statusVariant: "default" | "success" | "warning" | "destructive" = "success"

  if (flightData.cancelled) {
    status = "Cancelled"
    statusVariant = "destructive"
  } else if (flightData.diverted) {
    status = "Diverted"
    statusVariant = "warning"
  } else if (flightData.departureDelay && flightData.departureDelay > 30) {
    status = `Delayed (${flightData.departureDelay} min)`
    statusVariant = "warning"
  }

  // Format dates
  const scheduledDeparture = new Date(flightData.scheduledDepartureTime)
  const scheduledArrival = new Date(flightData.scheduledArrivalTime)

  const actualDeparture = flightData.actualDepartureTime ? new Date(flightData.actualDepartureTime) : null
  const actualArrival = flightData.actualArrivalTime ? new Date(flightData.actualArrivalTime) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="h-6 w-6" />
            {flightData.airlineName} {flightData.airlineCode}
            {flightData.flightNumber}
          </h2>
          <p className="text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-1" />
            {scheduledDeparture.toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant} className="text-md px-3 py-1">
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-full p-3">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {flightData.originAirportName} ({flightData.originAirport})
                </h3>
                <p className="text-muted-foreground">
                  {flightData.originCity}, {flightData.originState}
                </p>
                <div className="mt-2">
                  <p className="font-medium">Scheduled: {scheduledDeparture.toLocaleTimeString()}</p>
                  {actualDeparture && (
                    <p className="text-muted-foreground">Actual: {actualDeparture.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-full p-3">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {flightData.destAirportName} ({flightData.destAirport})
                </h3>
                <p className="text-muted-foreground">
                  {flightData.destCity}, {flightData.destState}
                </p>
                <div className="mt-2">
                  <p className="font-medium">Scheduled: {scheduledArrival.toLocaleTimeString()}</p>
                  {actualArrival && (
                    <p className="text-muted-foreground">Actual: {actualArrival.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Flight Duration</p>
                <p className="font-medium">{flightData.elapsedTime ? `${flightData.elapsedTime} min` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-medium">{flightData.distance ? `${flightData.distance} miles` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {flightData.departureDelay > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Delay Reason</p>
                  <p className="font-medium">
                    {flightData.weatherDelay > 0
                      ? "Weather"
                      : flightData.carrierDelay > 0
                        ? "Carrier"
                        : flightData.nasDelay > 0
                          ? "Air Traffic Control"
                          : flightData.lateAircraftDelay > 0
                            ? "Late Aircraft"
                            : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {flightData.predictionId && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Delay Prediction</h3>
            <p>
              {flightData.predictionReason ||
                `Predicted delays: Departure ${flightData.predictedDepartureDelay || 0} min, 
                Arrival ${flightData.predictedArrivalDelay || 0} min`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
