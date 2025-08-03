import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flight Delay Prediction System",
  description: "Predict and analyze flight delays with real-time weather data",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b">
          <div className="container mx-auto p-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                Flight Delay System
              </Link>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/flights" className="hover:underline">
                    Flights
                  </Link>
                </li>
                <li>
                  <Link href="/advanced" className="hover:underline">
                    Advanced DB
                  </Link>
                </li>
                <li>
                  <Link href="/advanced-analysis" className="hover:underline">
                    Analysis
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
