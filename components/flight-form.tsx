"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getAirlines, getAirports, createFlight, updateFlight } from "@/lib/data"
import type { Flight, Airline, Airport } from "@/lib/types"

const flightFormSchema = z.object({
  airlineCode: z.string().min(1, "Airline is required"),
  flightNumber: z.coerce.number().int().positive("Flight number must be a positive integer"),
  originAirport: z.string().min(1, "Origin airport is required"),
  destAirport: z.string().min(1, "Destination airport is required"),
  scheduledDepartureTime: z.string().min(1, "Scheduled departure time is required"),
  scheduledArrivalTime: z.string().min(1, "Scheduled arrival time is required"),
  elapsedTime: z.coerce.number().optional(),
  distance: z.coerce.number().optional(),
})

type FlightFormValues = z.infer<typeof flightFormSchema>

interface FlightFormProps {
  flight?: Flight
}

export function FlightForm({ flight }: FlightFormProps) {
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: flight
      ? {
          airlineCode: flight.airlineCode,
          flightNumber: flight.flightNumber,
          originAirport: flight.originAirport,
          destAirport: flight.destAirport,
          scheduledDepartureTime: new Date(flight.scheduledDepartureTime).toISOString().slice(0, 16),
          scheduledArrivalTime: new Date(flight.scheduledArrivalTime).toISOString().slice(0, 16),
          elapsedTime: flight.elapsedTime,
          distance: flight.distance,
        }
      : {
          airlineCode: "",
          flightNumber: undefined,
          originAirport: "",
          destAirport: "",
          scheduledDepartureTime: "",
          scheduledArrivalTime: "",
          elapsedTime: undefined,
          distance: undefined,
        },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airlinesData, airportsData] = await Promise.all([getAirlines(), getAirports()])
        setAirlines(airlinesData)
        setAirports(airportsData)
      } catch (error) {
        console.error("Error fetching form data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values: FlightFormValues) {
    try {
      if (flight) {
        await updateFlight(flight.flightId, values)
      } else {
        await createFlight(values)
      }
      router.push("/flights")
      router.refresh()
    } catch (error) {
      console.error("Error saving flight:", error)
    }
  }

  if (loading) {
    return <p>Loading form data...</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="airlineCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airlines.map((airline) => (
                      <SelectItem key={airline.airlineCode} value={airline.airlineCode}>
                        {airline.name} ({airline.airlineCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flightNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flight Number</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Airport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airportCode} value={airport.airportCode}>
                        {airport.name} ({airport.airportCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Airport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airportCode} value={airport.airportCode}>
                        {airport.name} ({airport.airportCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledDepartureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Departure Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledArrivalTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Arrival Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="elapsedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elapsed Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (miles)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{flight ? "Update Flight" : "Create Flight"}</Button>
        </div>
      </form>
    </Form>
  )
}
