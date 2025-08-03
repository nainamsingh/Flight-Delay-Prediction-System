import { FlightForm } from "@/components/flight-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewFlightPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Flight</h1>

      <Card>
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
          <CardDescription>Enter the details for the new flight</CardDescription>
        </CardHeader>
        <CardContent>
          <FlightForm />
        </CardContent>
      </Card>
    </main>
  )
}
