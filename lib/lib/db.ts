import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

export const db = {
  /**
   * Execute a SQL query with parameters
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows as T[]
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },

  /**
   * Execute a SQL statement with parameters
   */
  async execute(sql: string, params: any[] = []): Promise<void> {
    try {
      await pool.execute(sql, params)
    } catch (error) {
      console.error("Database execute error:", error)
      throw error
    }
  },

  /**
   * Execute a transaction with parameters
   */
  async transaction<T = any>(sql: string, params: any[] = []): Promise<T> {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const [result] = await connection.execute(sql, params)
      await connection.commit()
      return result as T
    } catch (error) {
      await connection.rollback()
      console.error("Transaction error:", error)
      throw error
    } finally {
      connection.release()
    }
  },
}

// Test the database connection
;(async () => {
  try {
    const [result] = await pool.execute("SELECT 1 as connection_test")
    console.log("Database connection successful:", result)
  } catch (error) {
    console.error("Failed to connect to the database:", error)
  }
})()
