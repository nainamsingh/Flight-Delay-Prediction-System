import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchFlights } from "@/components/search-flights"
import { FlightStatusOverview } from "@/components/flight-status-overview"

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Flight Delay Prediction System</h1>
        <p className="text-xl text-muted-foreground">Predict and analyze flight delays with real-time weather data</p>
      </section>

      <SearchFlights />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Flight Management</CardTitle>
            <CardDescription>Create, view, update, and delete flight information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/flights">Manage Flights</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Database</CardTitle>
            <CardDescription>Access stored procedures, transactions, triggers, and constraints</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/advanced">Advanced Features</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Analysis</CardTitle>
            <CardDescription>Explore advanced analytics on flight delays and weather impacts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/advanced-analysis">View Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <FlightStatusOverview />
    </main>
  )
}
