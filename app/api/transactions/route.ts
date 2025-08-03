import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// This API route allows executing transactions from the client side
export async function POST(request: Request) {
  try {
    const { transactionName, params } = await request.json()

    if (!transactionName) {
      return NextResponse.json({ error: "Transaction name is required" }, { status: 400 })
    }

    const paramNames = Object.keys(params || {})
    const paramPlaceholders = paramNames.map(() => "?").join(", ")
    const paramValues = Object.values(params || {})

    const result = await db.transaction(`CALL ${transactionName}(${paramPlaceholders})`, paramValues)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error executing transaction:", error)
    return NextResponse.json({ error: "Failed to execute transaction" }, { status: 500 })
  }
}
