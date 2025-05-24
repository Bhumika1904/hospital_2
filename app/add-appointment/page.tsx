
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useData } from "@/context/data-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AddAppointment() {
  const router = useRouter()
  const { toast } = useToast()
  const { doctors, isLoading } = useData()

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientId: "", // Allow user to enter patient ID
    symptoms: "",
    doctorId: "",
    doctorName: "",
    date: "tomorrow", // Default to tomorrow
    time: "", // Will be set when user selects a time
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState<number | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [bypassAvailability, setBypassAvailability] = useState(false)

  // Debug output for doctors
  useEffect(() => {
    console.log("Available doctors:", doctors)
  }, [doctors])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDoctorSelect = (index: number) => {
    if (index >= 0 && index < doctors.length) {
      const doctor = doctors[index]
      setSelectedDoctorIndex(index)
      setFormData((prev) => ({
        ...prev,
        doctorId: doctor._id,
        doctorName: doctor.name,
      }))
      console.log(`Selected doctor: ${doctor.name} (ID: ${doctor._id})`)
    }
  }

  const handleDateSelect = (date: string) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time)
    setFormData((prev) => ({ ...prev, time }))
    console.log(`Time selected: ${time}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebugInfo(null)

    // Validate form
    if (
      !formData.patientName ||
      !formData.patientPhone ||
      !formData.patientId ||
      !formData.doctorId ||
      !formData.time
    ) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the appointment data
      const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms || "",
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        doctorName: formData.doctorName,
        status: "Scheduled",
        forceBooking: bypassAvailability,
        // Add these fields explicitly to ensure they're saved
        patient: {
          id: formData.patientId,
          name: formData.patientName,
          phone: formData.patientPhone,
        },
        doctor: {
          id: formData.doctorId,
          name: formData.doctorName,
        },
      }

      console.log("Submitting appointment with data:", appointmentData)
      setDebugInfo(appointmentData)

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
        body: JSON.stringify(appointmentData),
      })

      // Handle response
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create appointment")
      }

      const data = await response.json()
      console.log("Appointment created:", data)

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      })

      // Redirect to appointments page
      router.push("/appointments")
    } catch (error: any) {
      console.error("Error booking appointment:", error)

      setError(error.message || "Failed to book appointment")

      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add Appointment</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex items-center space-x-2">
          <Switch id="bypass-availability" checked={bypassAvailability} onCheckedChange={setBypassAvailability} />
          <Label htmlFor="bypass-availability" className="font-medium">
            Bypass Doctor Availability Check
          </Label>
          <span className="text-sm text-muted-foreground ml-2">
            (Use this if you're getting "doctor not available" errors)
          </span>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Important</h2>
          <p className="text-blue-700 mb-2">
            You need to create a patient first and use their ID. If you haven't created a patient yet, please do so
            first.
          </p>
          <Button
            variant="outline"
            className="bg-blue-100 hover:bg-blue-200 border-blue-300"
            onClick={() => router.push("/create-patient")}
          >
            Create a Patient First
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium mb-1">
                      Patient ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter the patient ID from the created patient"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This must be a valid patient ID from your database. Create a patient first if needed.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="patientName" className="block text-sm font-medium mb-1">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="patientPhone" className="block text-sm font-medium mb-1">
                      Patient Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="patientPhone"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="symptoms" className="block text-sm font-medium mb-1">
                      Symptoms
                    </label>
                    <Textarea
                      id="symptoms"
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Assign Doctor <span className="text-red-500">*</span>
                    </label>

                    {isLoading ? (
                      <div className="text-sm text-muted-foreground">Loading doctors...</div>
                    ) : doctors.length === 0 ? (
                      <div className="text-sm text-red-500">No doctors available</div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {doctors.map((doctor, index) => (
                          <Button
                            key={doctor._id}
                            type="button"
                            variant={selectedDoctorIndex === index ? "default" : "outline"}
                            className="justify-start h-auto py-3 px-4"
                            onClick={() => handleDoctorSelect(index)}
                          >
                            <div className="flex flex-col items-start text-left">
                              <span className="font-medium">{doctor.name}</span>
                              <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}

                    {formData.doctorId && (
                      <div className="mt-2 text-sm text-green-600">Selected doctor: {formData.doctorName}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={formData.date === "today" ? "default" : "outline"}
                        onClick={() => handleDateSelect("today")}
                      >
                        Today
                      </Button>
                      <Button
                        type="button"
                        variant={formData.date === "tomorrow" ? "default" : "outline"}
                        onClick={() => handleDateSelect("tomorrow")}
                      >
                        Tomorrow
                      </Button>
                      <Button
                        type="button"
                        variant={formData.date === "30 Apr 2025" ? "default" : "outline"}
                        onClick={() => handleDateSelect("30 Apr 2025")}
                      >
                        30 Apr 2025
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Time <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Morning (9:00AM-12:30PM)</p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {["9:00AM", "9:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", "12:00PM", "12:30PM"].map(
                          (time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTimeSlot === time ? "default" : "outline"}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ),
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">Evening (4:30PM-9:00PM)</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
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
                        ].map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>

        {debugInfo && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
