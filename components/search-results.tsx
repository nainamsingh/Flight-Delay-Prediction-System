"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { searchFlights, searchAirlines, searchAirports } from "@/lib/data"
import type { Flight, Airline, Airport } from "@/lib/types"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        const [flightsData, airlinesData, airportsData] = await Promise.all([
          searchFlights(query),
          searchAirlines(query),
          searchAirports(query),
        ])
        setFlights(flightsData)
        setAirlines(airlinesData)
        setAirports(airportsData)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query])

  if (loading) {
    return <p>Searching...</p>
  }

  if (!query) {
    return <p>Please enter a search query.</p>
  }

  if (flights.length === 0 && airlines.length === 0 && airports.length === 0) {
    return <p>No results found for "{query}".</p>
  }

  return (
    <Tabs defaultValue="flights">
      <TabsList className="mb-4">
        <TabsTrigger value="flights">Flights ({flights.length})</TabsTrigger>
        <TabsTrigger value="airlines">Airlines ({airlines.length})</TabsTrigger>
        <TabsTrigger value="airports">Airports ({airports.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="flights">
        {flights.length === 0 ? (
          <p>No flights found matching "{query}".</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline</TableHead>
                  <TableHead>Flight #</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.flightId}>
                    <TableCell className="font-medium">{flight.airlineCode}</TableCell>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{flight.originAirport}</TableCell>
                    <TableCell>{flight.destAirport}</TableCell>
                    <TableCell>{new Date(flight.scheduledDepartureTime).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/search?q=${flight.airlineCode}${flight.flightNumber}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="airlines">
        {airlines.length === 0 ? (
          <p>No airlines found matching "{query}".</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>DOT Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airlines.map((airline) => (
                  <TableRow key={airline.airlineCode}>
                    <TableCell className="font-medium">{airline.airlineCode}</TableCell>
                    <TableCell>{airline.name}</TableCell>
                    <TableCell>{airline.dotCode || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="airports">
        {airports.length === 0 ? (
          <p>No airports found matching "{query}".</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airport Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Time Zone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airports.map((airport) => (
                  <TableRow key={airport.airportCode}>
                    <TableCell className="font-medium">{airport.airportCode}</TableCell>
                    <TableCell>{airport.name}</TableCell>
                    <TableCell>{airport.city}</TableCell>
                    <TableCell>{airport.state || "N/A"}</TableCell>
                    <TableCell>{airport.timeZone || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
