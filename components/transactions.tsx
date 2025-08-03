"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { executeTransaction } from "@/lib/data"

export function Transactions() {
  const [flightId, setFlightId] = useState("")
  const [statusId, setStatusId] = useState("")
  const [departureDelay, setDepartureDelay] = useState("")
  const [arrivalDelay, setArrivalDelay] = useState("")
  const [cancelled, setCancelled] = useState(false)
  const [weatherDelay, setWeatherDelay] = useState("")
  const [carrierDelay, setCarrierDelay] = useState("")

  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdateFlightStatus = async () => {
    if (!flightId || !statusId) {
      setResult({
        success: false,
        message: "Flight ID and Status ID are required",
      })
      return
    }

    try {
      setLoading(true)
      const data = await executeTransaction("UpdateFlightStatusWithPrediction", {
        p_flight_id: flightId,
        p_status_id: statusId,
        p_departure_delay: departureDelay ? Number.parseFloat(departureDelay) : null,
        p_arrival_delay: arrivalDelay ? Number.parseFloat(arrivalDelay) : null,
        p_cancelled: cancelled ? 1 : 0,
        p_weather_delay: weatherDelay ? Number.parseFloat(weatherDelay) : null,
        p_carrier_delay: carrierDelay ? Number.parseFloat(carrierDelay) : null,
      })

      setResult({
        success: true,
        message: "Transaction executed successfully. Flight status updated and prediction created.",
      })
    } catch (error) {
      console.error("Error executing transaction:", error)
      setResult({
        success: false,
        message: "Transaction failed. See console for details.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkCancellation = async () => {
    try {
      setLoading(true)
      const data = await executeTransaction("BulkCancellationDueToWeather", {
        p_airport_code: flightId, // Reusing flightId input as airport code
        p_cancellation_code: "B", // B for weather
        p_weather_event_id: statusId, // Reusing statusId input as weather event ID
      })

      setResult({
        success: true,
        message: `Transaction executed successfully. Affected flights: ${data.affectedFlights || "unknown"}`,
      })
    } catch (error) {
      console.error("Error executing transaction:", error)
      setResult({
        success: false,
        message: "Transaction failed. See console for details.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Flight Status with Prediction</CardTitle>
            <CardDescription>Update flight status and automatically generate a delay prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="flightId">Flight ID</Label>
                <Input
                  id="flightId"
                  placeholder="Enter flight ID"
                  value={flightId}
                  onChange={(e) => setFlightId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statusId">Status ID</Label>
                <Input
                  id="statusId"
                  placeholder="Enter status ID"
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="departureDelay">Departure Delay (min)</Label>
                  <Input
                    id="departureDelay"
                    type="number"
                    placeholder="0"
                    value={departureDelay}
                    onChange={(e) => setDepartureDelay(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="arrivalDelay">Arrival Delay (min)</Label>
                  <Input
                    id="arrivalDelay"
                    type="number"
                    placeholder="0"
                    value={arrivalDelay}
                    onChange={(e) => setArrivalDelay(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="weatherDelay">Weather Delay (min)</Label>
                  <Input
                    id="weatherDelay"
                    type="number"
                    placeholder="0"
                    value={weatherDelay}
                    onChange={(e) => setWeatherDelay(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carrierDelay">Carrier Delay (min)</Label>
                  <Input
                    id="carrierDelay"
                    type="number"
                    placeholder="0"
                    value={carrierDelay}
                    onChange={(e) => setCarrierDelay(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cancelled"
                  checked={cancelled}
                  onChange={(e) => setCancelled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="cancelled">Flight Cancelled</Label>
              </div>
              <Button onClick={handleUpdateFlightStatus} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Execute Transaction"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Flight Cancellation</CardTitle>
            <CardDescription>Cancel multiple flights due to a weather event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="airportCode">Airport Code</Label>
                <Input
                  id="airportCode"
                  placeholder="e.g. ORD"
                  value={flightId} // Reusing flightId input
                  onChange={(e) => setFlightId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weatherEventId">Weather Event ID</Label>
                <Input
                  id="weatherEventId"
                  placeholder="Enter weather event ID"
                  value={statusId} // Reusing statusId input
                  onChange={(e) => setStatusId(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This transaction will cancel all flights departing from the specified airport that are affected by the
                weather event. It uses SERIALIZABLE isolation level to ensure data consistency.
              </p>
              <Button onClick={handleBulkCancellation} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Execute Transaction"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
