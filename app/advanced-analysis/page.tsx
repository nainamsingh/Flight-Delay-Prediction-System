import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherImpactAnalysis } from "@/components/weather-impact-analysis"
import { TemporalAnalysis } from "@/components/temporal-analysis"
import { AirlinePerformanceComparison } from "@/components/airline-performance-comparison"

export default function AdvancedAnalysisPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Advanced Data Analysis</h1>
      <p className="text-muted-foreground">Explore advanced analytics on flight delays and weather impacts</p>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>Analyze flight delays with advanced SQL queries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weather-impact">
            <TabsList className="mb-4">
              <TabsTrigger value="weather-impact">Weather Impact</TabsTrigger>
              <TabsTrigger value="temporal-analysis">Temporal Analysis</TabsTrigger>
              <TabsTrigger value="airline-performance">Airline Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="weather-impact">
              <WeatherImpactAnalysis />
            </TabsContent>
            <TabsContent value="temporal-analysis">
              <TemporalAnalysis />
            </TabsContent>
            <TabsContent value="airline-performance">
              <AirlinePerformanceComparison />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
