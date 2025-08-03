import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { FlightStatus } from "@/lib/types"

interface FlightStatusTableProps {
  flightStatuses: FlightStatus[]
  loading: boolean
}

export function FlightStatusTable({ flightStatuses, loading }: FlightStatusTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (flightStatuses.length === 0) {
    return <p className="text-center py-4">No flight status data available.</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Origin/Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Departure Delay</TableHead>
            <TableHead>Arrival Delay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flightStatuses.map((status) => (
            <TableRow key={status.statusId}>
              <TableCell className="font-medium">
                {status.flight ? `${status.flight.airlineCode} ${status.flight.flightNumber}` : "N/A"}
              </TableCell>
              <TableCell>{new Date(status.flightDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {status.flight ? `${status.flight.originAirport} → ${status.flight.destAirport}` : "N/A"}
              </TableCell>
              <TableCell>
                {status.cancelled ? (
                  <Badge variant="destructive">Cancelled</Badge>
                ) : status.departureDelay && status.departureDelay > 30 ? (
                  <Badge variant="warning">Delayed</Badge>
                ) : (
                  <Badge variant="success">On Time</Badge>
                )}
              </TableCell>
              <TableCell>{status.departureDelay ? `${status.departureDelay} min` : "N/A"}</TableCell>
              <TableCell>{status.arrivalDelay ? `${status.arrivalDelay} min` : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
