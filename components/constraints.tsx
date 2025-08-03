import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Constraints() {
  const constraints = [
    {
      name: "Primary Keys",
      description: "Unique identifier for each record",
      examples: [
        "User(userId)",
        "Airline(airlineCode)",
        "Airport(airportCode)",
        "Flight(flightId)",
        "Flight_Status(statusId)",
        "Delay_Prediction(predictionId)",
        "Weather_Event(eventId)",
        "User_Alert(alertId)",
      ],
    },
    {
      name: "Foreign Keys",
      description: "Ensures referential integrity between tables",
      examples: [
        "Flight(airlineCode) → Airline(airlineCode)",
        "Flight(originAirport) → Airport(airportCode)",
        "Flight(destAirport) → Airport(airportCode)",
        "Flight_Status(flightId) → Flight(flightId)",
        "Delay_Prediction(flightId) → Flight(flightId)",
        "Weather_Event(airportCode) → Airport(airportCode)",
        "User_Alert(userId) → User(userId)",
      ],
    },
    {
      name: "NOT NULL Constraints",
      description: "Ensures required fields have values",
      examples: [
        "User(username, email, password)",
        "Airline(airlineCode, name)",
        "Airport(airportCode, name, city)",
        "Flight(flightId, airlineCode, flightNumber, originAirport, destAirport, scheduledDepartureTime, scheduledArrivalTime)",
        "Flight_Status(statusId, flightId, flightDate)",
        "Delay_Prediction(predictionId, flightId, predictionTime)",
        "Weather_Event(eventId, airportCode, type, startTime, endTime)",
      ],
    },
    {
      name: "Check Constraints",
      description: "Validates data before insertion or update",
      examples: [
        "Flight_Status: CHECK (departureDelay >= 0)",
        "Flight_Status: CHECK (arrivalDelay >= 0)",
        "Flight: CHECK (originAirport != destAirport)",
        "Weather_Event: CHECK (endTime > startTime)",
        "User_Alert: CHECK (delayThreshold > 0)",
      ],
    },
    {
      name: "Unique Constraints",
      description: "Ensures no duplicate values in specified columns",
      examples: [
        "User(email)",
        "Airline(airlineCode, dotCode)",
        "Flight(airlineCode, flightNumber, scheduledDepartureTime)",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Constraints</CardTitle>
          <CardDescription>Rules enforced on database columns to maintain data integrity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Constraint Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Examples</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constraints.map((constraint) => (
                  <TableRow key={constraint.name}>
                    <TableCell className="font-medium">{constraint.name}</TableCell>
                    <TableCell>{constraint.description}</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5 space-y-1">
                        {constraint.examples.map((example, index) => (
                          <li key={index}>
                            <code className="bg-muted p-1 rounded text-xs">{example}</code>
                          </li>
                        ))}
                      </ul>
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
