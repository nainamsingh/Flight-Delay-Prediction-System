"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { getAirlinePerformanceComparison } from "@/lib/data"

export function AirlinePerformanceComparison() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const results = await getAirlinePerformanceComparison()
        setData(results)
      } catch (error) {
        console.error("Error fetching airline performance comparison:", error)
        setError("Failed to load airline performance data")
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
    return <div>No airline performance data available.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Airline Performance During Weather Events</CardTitle>
          <CardDescription>
            Comparison of airline performance during normal conditions vs. during weather events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline</TableHead>
                  <TableHead>Normal Delay (min)</TableHead>
                  <TableHead>Weather Delay (min)</TableHead>
                  <TableHead>Delay Difference</TableHead>
                  <TableHead>Weather Cancellation %</TableHead>
                  <TableHead>Total Flights</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.airline_name}</TableCell>
                    <TableCell>{row.avg_delay_normal || "N/A"}</TableCell>
                    <TableCell>{row.avg_delay_weather || "N/A"}</TableCell>
                    <TableCell
                      className={
                        row.delay_difference > 0 ? "text-red-500" : row.delay_difference < 0 ? "text-green-500" : ""
                      }
                    >
                      {row.delay_difference ? `${row.delay_difference.toFixed(2)}` : "N/A"}
                    </TableCell>
                    <TableCell>{row.cancellation_pct_weather || "0.00"}%</TableCell>
                    <TableCell>{row.total_flights}</TableCell>
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
