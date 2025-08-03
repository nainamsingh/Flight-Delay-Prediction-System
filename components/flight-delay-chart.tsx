"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import type { FlightStatus } from "@/lib/types"

interface FlightDelayChartProps {
  flightStatuses: FlightStatus[]
  loading: boolean
}

export function FlightDelayChart({ flightStatuses, loading }: FlightDelayChartProps) {
  if (loading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (flightStatuses.length === 0) {
    return <p className="text-center py-4">No flight delay data available for visualization.</p>
  }

  // Process data for chart
  const chartData = flightStatuses.map((status) => ({
    flight: status.flight
      ? `${status.flight.airlineCode}${status.flight.flightNumber}`
      : `Flight ${status.statusId.substring(0, 4)}`,
    departureDelay: status.departureDelay || 0,
    arrivalDelay: status.arrivalDelay || 0,
    weatherDelay: status.weatherDelay || 0,
    carrierDelay: status.carrierDelay || 0,
  }))

  return (
    <div className="h-[350px] w-full">
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
          <XAxis dataKey="flight" angle={-45} textAnchor="end" height={60} />
          <YAxis label={{ value: "Delay (minutes)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="departureDelay" name="Departure Delay" fill="#8884d8" />
          <Bar dataKey="arrivalDelay" name="Arrival Delay" fill="#82ca9d" />
          <Bar dataKey="weatherDelay" name="Weather Delay" fill="#ffc658" />
          <Bar dataKey="carrierDelay" name="Carrier Delay" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
