"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plane } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SearchFlights() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Flight Search
        </CardTitle>
        <CardDescription>Enter a flight number (e.g., AA123) to check its status and details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter flight number (e.g., AA123)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
