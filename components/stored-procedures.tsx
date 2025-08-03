"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { executeStoredProcedure } from "@/lib/data"

export function StoredProcedures() {
  const [airportCode, setAirportCode] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGetWeatherImpact = async () => {
    if (!airportCode) {
      setError("Airport code is required")
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = await executeStoredProcedure("GetWeatherImpactOnDelays", {
        p_airport_code: airportCode,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
      })
      setResults(data)
    } catch (error) {
      console.error("Error executing stored procedure:", error)
      setError("Failed to execute stored procedure. Check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetAirlinePerformance = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await executeStoredProcedure("GetAirlinePerformanceMetrics", {})
      setResults(data)
    } catch (error) {
      console.error("Error executing stored procedure:", error)
      setError("Failed to execute stored procedure. Check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetRouteAnalysis = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await executeStoredProcedure("GetRouteDelayAnalysis", {})
      setResults(data)
    } catch (error) {
      console.error("Error executing stored procedure:", error)
      setError("Failed to execute stored procedure. Check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weather Impact Analysis</CardTitle>
            <CardDescription>Analyze how weather events impact flight delays at a specific airport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="airportCode">Airport Code</Label>
                <Input
                  id="airportCode"
                  placeholder="e.g. ORD"
                  value={airportCode}
                  onChange={(e) => setAirportCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Button onClick={handleGetWeatherImpact} disabled={loading}>
                {loading ? "Processing..." : "Execute Procedure"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Airline Performance Metrics</CardTitle>
            <CardDescription>Get comprehensive performance metrics for all airlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This stored procedure calculates performance metrics for all airlines, including on-time percentage,
                average delays, and cancellation rates.
              </p>
              <Button onClick={handleGetAirlinePerformance} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Execute Procedure"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Delay Analysis</CardTitle>
            <CardDescription>Analyze delay patterns for specific routes between airports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This stored procedure analyzes delay patterns for routes between airports, identifying the most
                problematic routes and their average delays.
              </p>
              <Button onClick={handleGetRouteAnalysis} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Execute Procedure"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Procedure Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(results[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, i) => (
                        <TableCell key={i}>
                          {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
