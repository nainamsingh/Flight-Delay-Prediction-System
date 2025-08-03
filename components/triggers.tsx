import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Triggers() {
  const triggers = [
    {
      name: "after_flight_status_update",
      event: "AFTER UPDATE",
      table: "Flight_Status",
      description: "Automatically creates a delay prediction when a flight status is updated with a delay",
      condition: "NEW.departureDelay > 0 OR NEW.arrivalDelay > 0",
      action:
        "INSERT INTO Delay_Prediction (predictionId, flightId, predictionTime, predictedDepartureDelay, predictedArrivalDelay, notificationSent, predictionReason) VALUES (UUID(), NEW.flightId, NOW(), NEW.departureDelay * 1.1, NEW.arrivalDelay * 1.1, FALSE, 'Auto-generated from status update')",
    },
    {
      name: "before_flight_status_insert",
      event: "BEFORE INSERT",
      table: "Flight_Status",
      description: "Validates flight status data before insertion",
      condition: "NEW.departureDelay < 0 OR NEW.arrivalDelay < 0",
      action: "SET NEW.departureDelay = 0, NEW.arrivalDelay = 0",
    },
    {
      name: "after_weather_event_insert",
      event: "AFTER INSERT",
      table: "Weather_Event",
      description: "Automatically flags flights that might be affected by a new weather event",
      condition: "NEW.severity IN ('Severe', 'Extreme')",
      action:
        "UPDATE Flight_Status fs JOIN Flight f ON fs.flightId = f.flightId JOIN Airport a ON f.originAirport = a.airportCode SET fs.weatherDelay = COALESCE(fs.weatherDelay, 0) + 30 WHERE DATE(fs.flightDate) = DATE(NEW.startTime) AND SQRT(POW(a.locationLat - NEW.locationLat, 2) + POW(a.locationLng - NEW.locationLng, 2)) <= 2",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Triggers</CardTitle>
          <CardDescription>Automatic actions that execute in response to database events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trigger Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {triggers.map((trigger) => (
                  <TableRow key={trigger.name}>
                    <TableCell className="font-medium">{trigger.name}</TableCell>
                    <TableCell>{trigger.event}</TableCell>
                    <TableCell>{trigger.table}</TableCell>
                    <TableCell>{trigger.description}</TableCell>
                    <TableCell>
                      <code className="bg-muted p-1 rounded text-xs">{trigger.condition}</code>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted p-1 rounded text-xs whitespace-pre-wrap">{trigger.action}</code>
                    </TableCell>
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
