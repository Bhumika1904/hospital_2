"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleAppointmentTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testCreateAppointment = async () => {
    setLoading(true)
    setError(null)
    try {
      // Create a simple test appointment
      const testAppointment = {
        patientName: "Test Patient",
        patientPhone: "1234567890",
        symptoms: "Test symptoms",
        doctorId: "64f2ff46e854c632a8fb295e", // Replace with a valid doctor ID from your database
        doctorName: "Test Doctor",
        date: "tomorrow",
        time: "10:00AM",
        status: "Scheduled",
      }

      // Make the API request
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
        body: JSON.stringify(testAppointment),
      })

      // Get the response data
      const data = await response.json()

      setResult({
        success: response.ok,
        status: response.status,
        data: data,
      })
    } catch (err: any) {
      console.error("API Test Error:", err)
      setError(err.message || "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Simple Appointment Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={testCreateAppointment} disabled={loading}>
            {loading ? "Testing..." : "Create Test Appointment"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="font-semibold mb-2">Result:</p>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96 bg-white p-2 rounded border text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
