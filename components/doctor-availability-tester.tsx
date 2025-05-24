"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/context/data-context"

export function DoctorAvailabilityTester() {
  const { doctors } = useData()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("tomorrow")
  const [selectedTime, setSelectedTime] = useState("10:00AM")

  const morningTimes = ["9:00AM", "9:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", "12:00PM", "12:30PM"]
  const eveningTimes = [
    "4:30PM",
    "5:00PM",
    "5:30PM",
    "6:00PM",
    "6:30PM",
    "7:00PM",
    "7:30PM",
    "8:00PM",
    "8:30PM",
    "9:00PM",
  ]
  const dates = ["today", "tomorrow", "day after tomorrow", "next week"]

  const checkAvailability = async () => {
    if (!selectedDoctor) {
      setError("Please select a doctor")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Create a test appointment to check availability
      const testAppointment = {
        patientId: "test-patient-id", // This doesn't matter for availability check
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        patientName: "Test Patient",
        patientPhone: "1234567890",
        symptoms: "Test symptoms",
      }

      // Get token if available
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Make the API request
      const response = await fetch("http://localhost:5000/api/appointments/check-availability", {
        method: "POST",
        headers,
        body: JSON.stringify(testAppointment),
      })

      // Get the response data
      const data = await response.json()

      setResult({
        available: response.ok,
        status: response.status,
        message: data.message || (response.ok ? "Doctor is available" : "Doctor is not available"),
        data,
      })
    } catch (err: any) {
      console.error("Error checking availability:", err)
      setError(err.message || "Failed to check availability")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Doctor Availability Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="doctorSelect">Select Doctor</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateSelect">Select Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeSelect">Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Time</SelectItem>
                <SelectItem value="section-morning" disabled>
                  --- Morning ---
                </SelectItem>
                {morningTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
                <SelectItem value="section-evening" disabled>
                  --- Evening ---
                </SelectItem>
                {eveningTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTime === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="customTime">Custom Time (e.g., 3:45PM)</Label>
              <Input
                id="customTime"
                value={selectedTime === "custom" ? "" : selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                placeholder="Enter custom time"
              />
            </div>
          )}

          <Button onClick={checkAvailability} disabled={loading} className="w-full">
            {loading ? "Checking..." : "Check Availability"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div
              className={`p-4 ${
                result.available ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              } border rounded-md`}
            >
              <p className="font-semibold mb-2">{result.available ? "✅ Available:" : "❌ Not Available:"}</p>
              <p>{result.message}</p>
              {result.data && (
                <pre className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
