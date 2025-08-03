import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoredProcedures } from "@/components/stored-procedures"
import { Transactions } from "@/components/transactions"
import { Triggers } from "@/components/triggers"
import { Constraints } from "@/components/constraints"

export default function AdvancedPage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Advanced Database Features</h1>
      <p className="text-muted-foreground">Access and execute advanced database operations</p>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Database Features</CardTitle>
          <CardDescription>Execute stored procedures, transactions, and view triggers and constraints</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="procedures">
            <TabsList className="mb-4">
              <TabsTrigger value="procedures">Stored Procedures</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
            </TabsList>
            <TabsContent value="procedures">
              <StoredProcedures />
            </TabsContent>
            <TabsContent value="transactions">
              <Transactions />
            </TabsContent>
            <TabsContent value="triggers">
              <Triggers />
            </TabsContent>
            <TabsContent value="constraints">
              <Constraints />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
