"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { getTemporalAnalysis } from "@/lib/data"

export function TemporalAnalysis() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const results = await getTemporalAnalysis()
        setData(results)
      } catch (error) {
        console.error("Error fetching temporal analysis:", error)
        setError("Failed to load temporal analysis data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return <div>No temporal analysis data available.</div>
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    hour: `${item.departure_hour}:00`,
    carrier: item.carrier_delay_pct,
    weather: item.weather_delay_pct,
    nas: item.nas_delay_pct,
    security: item.security_delay_pct,
    lateAircraft: item.late_aircraft_delay_pct,
    avgDelay: item.avg_departure_delay,
    flightsNearWeather: item.flights_near_weather,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delay Types by Time of Day</CardTitle>
          <CardDescription>Analysis of how different types of delays vary throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="carrier" name="Carrier Delay %" fill="#8884d8" />
                <Bar dataKey="weather" name="Weather Delay %" fill="#82ca9d" />
                <Bar dataKey="nas" name="Air Traffic Delay %" fill="#ffc658" />
                <Bar dataKey="security" name="Security Delay %" fill="#ff8042" />
                <Bar dataKey="lateAircraft" name="Late Aircraft Delay %" fill="#0088fe" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
