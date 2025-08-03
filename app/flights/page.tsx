import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlightsTable } from "@/components/flights-table"

export default function FlightsPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flight Management</h1>
          <p className="text-muted-foreground">Create, view, update, and delete flight information</p>
        </div>
        <Button asChild>
          <Link href="/flights/new">Add New Flight</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Flights</CardTitle>
          <CardDescription>Manage flight information and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <FlightsTable />
        </CardContent>
      </Card>
    </main>
  )
}
