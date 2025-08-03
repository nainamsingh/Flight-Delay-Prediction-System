import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FlightSearchResult } from "@/components/flight-search-result"

interface SearchPageProps {
  searchParams: { q: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  // Check if the query matches a flight number pattern (e.g., AA123)
  const flightNumberMatch = query.match(/^([A-Z]{2})(\d+)$/i)

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
      <p className="text-muted-foreground">
        Showing results for: <span className="font-medium">{query}</span>
      </p>

      {flightNumberMatch ? (
        <Card>
          <CardHeader>
            <CardTitle>Flight Details</CardTitle>
            <CardDescription>Detailed information about flight {query.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <FlightSearchResult
                airlineCode={flightNumberMatch[1].toUpperCase()}
                flightNumber={Number.parseInt(flightNumberMatch[2], 10)}
              />
            </Suspense>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Flights, airlines, and airports matching your search</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResults query={query} />
            </Suspense>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
