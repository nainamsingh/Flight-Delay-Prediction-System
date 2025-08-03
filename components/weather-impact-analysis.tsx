"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getWeatherImpactAnalysis } from "@/lib/data"

export function WeatherImpactAnalysis() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const results = await getWeatherImpactAnalysis()
        setData(results)
      } catch (error) {
        console.error("Error fetching weather impact analysis:", error)
        setError("Failed to load weather impact analysis data")
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
    return <div>No weather impact data available.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact on Flight Delays</CardTitle>
          <CardDescription>
            Analysis of how different weather events impact flight delays based on distance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Weather Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Affected Flights</TableHead>
                  <TableHead>Avg. Departure Delay</TableHead>
                  <TableHead>Avg. Arrival Delay</TableHead>
                  <TableHead>Cancelled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.weather_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.weather_severity === "Extreme"
                            ? "destructive"
                            : row.weather_severity === "Severe"
                              ? "warning"
                              : "default"
                        }
                      >
                        {row.weather_severity || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.distance_category}</TableCell>
                    <TableCell>{row.affected_flights}</TableCell>
                    <TableCell>{row.avg_departure_delay} min</TableCell>
                    <TableCell>{row.avg_arrival_delay} min</TableCell>
                    <TableCell>{row.cancelled_flights}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
