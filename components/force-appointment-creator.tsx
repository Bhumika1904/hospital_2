"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useData } from "@/context/data-context"

export function ForceAppointmentCreator() {
  const { doctors } = useData()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestData, setRequestData] = useState<any>(null)
  const [responseData, setResponseData] = useState<any>(null)
  const [bypassAvailability, setBypassAvailability] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    patientId: "", // Will be filled by user
    doctorId: "", // Will be set when doctor is selected
    date: "tomorrow", // Default date
    time: "10:00AM", // Default time
    symptoms: "Fever, headache",
    patientName: "Test Patient",
    patientPhone: "1234567890",
    status: "Scheduled",
    forceBooking: true, // Add this field to bypass availability check
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle doctor selection
  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find((d) => d._id === doctorId)
    setFormData((prev) => ({
      ...prev,
      doctorId,
      doctorName: selectedDoctor?.name || "Unknown Doctor",
    }))
  }

  // Create appointment
  const createAppointment = async () => {
    if (!formData.patientId) {
      setError("Please enter a patient ID")
      return
    }

    if (!formData.doctorId) {
      setError("Please select a doctor")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setRequestData(null)
    setResponseData(null)

    try {
      // Add the forceBooking flag if bypass is enabled
      const appointmentData = {
        ...formData,
        forceBooking: bypassAvailability,
      }

      // Log what we're sending
      console.log("Sending appointment data:", appointmentData)
      setRequestData(appointmentData)

      // Get token if available
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Make the API request
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers,
        body: JSON.stringify(appointmentData),
      })

      // Get the response data
      const data = await response.json()
      console.log("Response from server:", data)
      setResponseData(data)

      if (response.ok) {
        setResult({
          success: true,
          message: "Appointment created successfully!",
          data,
        })
      } else {
        setError(`Error: ${data.message || response.statusText}`)
      }
    } catch (err: any) {
      console.error("API Error:", err)
      setError(err.message || "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Force Appointment Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="bypass-availability" checked={bypassAvailability} onCheckedChange={setBypassAvailability} />
            <Label htmlFor="bypass-availability">Bypass Availability Check</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="patientId">Patient ID (Required)</Label>
            <Input
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="Enter patient ID"
            />
            <p className="text-xs text-muted-foreground">
              This must be a valid patient ID from your database. Create a patient first if needed.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="doctorSelect">Select Doctor (Required)</Label>
            <Select onValueChange={handleDoctorChange}>
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
            <p className="text-xs text-muted-foreground">Selected Doctor ID: {formData.doctorId || "None"}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" value={formData.date} onChange={handleChange} />
            <p className="text-xs text-muted-foreground">
              Try "today", "tomorrow", or a specific date like "May 10, 2025"
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" name="time" value={formData.time} onChange={handleChange} />
            <p className="text-xs text-muted-foreground">Try different times like "10:00AM", "2:30PM", etc.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="patientPhone">Patient Phone</Label>
            <Input id="patientPhone" name="patientPhone" value={formData.patientPhone} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea id="symptoms" name="symptoms" value={formData.symptoms} onChange={handleChange} />
          </div>

          <Button onClick={createAppointment} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Appointment"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="font-semibold mb-2">Success:</p>
              <p>{result.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Request Data:</h3>
              <pre className="text-xs overflow-auto max-h-60 bg-gray-50 p-2 rounded border">
                {requestData ? JSON.stringify(requestData, null, 2) : "No data sent yet"}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Response Data:</h3>
              <pre className="text-xs overflow-auto max-h-60 bg-gray-50 p-2 rounded border">
                {responseData ? JSON.stringify(responseData, null, 2) : "No response yet"}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
