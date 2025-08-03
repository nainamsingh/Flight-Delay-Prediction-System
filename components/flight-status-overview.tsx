"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightStatusTable } from "@/components/flight-status-table"
import { FlightDelayChart } from "@/components/flight-delay-chart"
import { getFlightStatuses } from "@/lib/data"
import type { FlightStatus } from "@/lib/types"

export function FlightStatusOverview() {
  const [flightStatuses, setFlightStatuses] = useState<FlightStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlightStatuses()
        setFlightStatuses(data)
      } catch (error) {
        console.error("Error fetching flight statuses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Flight Status Overview</CardTitle>
        <CardDescription>Current flight statuses and delay information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <FlightStatusTable flightStatuses={flightStatuses} loading={loading} />
          </TabsContent>
          <TabsContent value="chart">
            <FlightDelayChart flightStatuses={flightStatuses} loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
