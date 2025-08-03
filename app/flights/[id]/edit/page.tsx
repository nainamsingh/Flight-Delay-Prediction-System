import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlightForm } from "@/components/flight-form"
import { getFlight } from "@/lib/data"

interface EditFlightPageProps {
  params: { id: string }
}

export default async function EditFlightPage({ params }: EditFlightPageProps) {
  const flight = await getFlight(params.id)

  if (!flight) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Edit Flight {flight.airlineCode} {flight.flightNumber}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
          <CardDescription>Update the flight information</CardDescription>
        </CardHeader>
        <CardContent>
          <FlightForm flight={flight} />
        </CardContent>
      </Card>
    </main>
  )
}
