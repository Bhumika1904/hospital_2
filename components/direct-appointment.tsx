"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DirectAppointmentCreator() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientPhone: "",
    doctorId: "",
    doctorName: "",
    date: "tomorrow",
    time: "10:00AM",
    symptoms: "Fever, headache",
    status: "Scheduled",
    forceBooking: true,
  })

  // Fetch doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        // Fetch doctors
        const doctorsResponse = await fetch("http://localhost:5000/api/doctors", {
          headers: {
            ...(localStorage.getItem("token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              : {}),
          },
        })
        const doctorsData = await doctorsResponse.json()
        const doctorsList = Array.isArray(doctorsData) ? doctorsData : doctorsData.doctors || []
        setDoctors(doctorsList)

        // Fetch patients
        const patientsResponse = await fetch("http://localhost:5000/api/patients", {
          headers: {
            ...(localStorage.getItem("token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              : {}),
          },
        })
        const patientsData = await patientsResponse.json()
        const patientsList = Array.isArray(patientsData) ? patientsData : patientsData.patients || []
        setPatients(patientsList)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find((p) => p._id === patientId || p.id === patientId)
    if (selectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patientId,
        patientName:
          selectedPatient.name || `${selectedPatient.firstName || ""} ${selectedPatient.lastName || ""}`.trim(),
        patientPhone: selectedPatient.phone || selectedPatient.contactNumber || "",
      }))
    }
  }

  const handleDoctorSelect = (doctorId: string) => {
    const selectedDoctor = doctors.find((d) => d._id === doctorId)
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorId,
        doctorName: selectedDoctor.name || "Unknown Doctor",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Make direct API call
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
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Appointment creation response:", data)

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment")
      }

      setResult({
        success: true,
        message: "Appointment created successfully!",
        data,
      })

      toast({
        title: "Success",
        description: "Appointment created successfully",
      })
    } catch (error: any) {
      console.error("Error creating appointment:", error)

      setResult({
        success: false,
        message: error.message || "Failed to create appointment",
      })

      toast({
        title: "Error",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct Appointment Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientSelect">Select Patient</Label>
              <Select onValueChange={handlePatientSelect} disabled={loadingData}>
                <SelectTrigger id="patientSelect">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient._id || patient.id} value={patient._id || patient.id}>
                      {patient.name ||
                        `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
                        "Unknown Patient"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorSelect">Select Doctor</Label>
              <Select onValueChange={handleDoctorSelect} disabled={loadingData}>
                <SelectTrigger id="doctorSelect">
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

            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientPhone">Patient Phone</Label>
              <Input id="patientPhone" name="patientPhone" value={formData.patientPhone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor ID</Label>
              <Input id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" value={formData.time} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea id="symptoms" name="symptoms" value={formData.symptoms} onChange={handleChange} rows={3} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Appointment"}
          </Button>
        </form>

        {result && (
          <div
            className={`mt-4 p-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-md`}
          >
            <p className="font-semibold mb-2">{result.success ? "Success:" : "Error:"}</p>
            <p>{result.message}</p>
            {result.data && (
              <pre className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
