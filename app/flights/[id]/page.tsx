import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getFlight } from "@/lib/data"

interface FlightDetailPageProps {
  params: { id: string }
}

export default async function FlightDetailPage({ params }: FlightDetailPageProps) {
  const flight = await getFlight(params.id)

  if (!flight) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Flight {flight.airlineCode} {flight.flightNumber}
          </h1>
          <p className="text-muted-foreground">
            {flight.originAirport} to {flight.destAirport}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/flights/${flight.flightId}/edit`}>Edit Flight</Link>
          </Button>
          <Button asChild>
            <Link href="/flights">Back to Flights</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flight Details</CardTitle>
            <CardDescription>Basic information about the flight</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Airline Code</dt>
                <dd className="text-lg">{flight.airlineCode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Flight Number</dt>
                <dd className="text-lg">{flight.flightNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Origin</dt>
                <dd className="text-lg">{flight.originAirport}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Destination</dt>
                <dd className="text-lg">{flight.destAirport}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Scheduled Departure</dt>
                <dd className="text-lg">{new Date(flight.scheduledDepartureTime).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Scheduled Arrival</dt>
                <dd className="text-lg">{new Date(flight.scheduledArrivalTime).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Elapsed Time</dt>
                <dd className="text-lg">{flight.elapsedTime ? `${flight.elapsedTime} min` : "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Distance</dt>
                <dd className="text-lg">{flight.distance ? `${flight.distance} miles` : "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flight Status</CardTitle>
            <CardDescription>Current status and delay information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40 border rounded-md">
              <p className="text-muted-foreground">Status information will appear here</p>
              <Button className="mt-4" asChild>
                <Link href={`/advanced?flightId=${flight.flightId}`}>Update Status</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
