import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// This API route allows executing stored procedures from the client side
// It's useful for debugging and testing stored procedures
export async function POST(request: Request) {
  try {
    const { procedureName, params } = await request.json()

    if (!procedureName) {
      return NextResponse.json({ error: "Procedure name is required" }, { status: 400 })
    }

    const paramNames = Object.keys(params || {})
    const paramPlaceholders = paramNames.map(() => "?").join(", ")
    const paramValues = Object.values(params || {})

    const results = await db.query(`CALL ${procedureName}(${paramPlaceholders})`, paramValues)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error executing stored procedure:", error)
    return NextResponse.json({ error: "Failed to execute stored procedure" }, { status: 500 })
  }
}
