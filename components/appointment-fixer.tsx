"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function AppointmentFixer() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])

  // Fetch all data
  const fetchData = async () => {
    setLoading(true)
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

      // Fetch appointments
      const appointmentsResponse = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
      })
      const appointmentsData = await appointmentsResponse.json()
      const appointmentsList = Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.appointments || []
      setAppointments(appointmentsList)

      setResult({
        success: true,
        message: "Data fetched successfully",
        counts: {
          doctors: doctorsList.length,
          patients: patientsList.length,
          appointments: appointmentsList.length,
        },
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setResult({
        success: false,
        message: "Error fetching data",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fix appointments
  const fixAppointments = async () => {
    setLoading(true)
    try {
      let fixedCount = 0
      let errorCount = 0

      // Create maps for quick lookup
      const doctorMap = new Map(doctors.map((d) => [d._id, d]))
      const patientMap = new Map(patients.map((p) => [p._id || p.id, p]))

      // Process each appointment
      for (const appointment of appointments) {
        try {
          // Find patient and doctor
          const patient = patientMap.get(appointment.patientId)
          const doctor = doctorMap.get(appointment.doctorId)

          // Skip if we can't find patient or doctor
          if (!patient && !doctor) continue

          // Prepare update data
          const updateData: any = {}

          if (patient) {
            const patientName =
              patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unknown Patient"
            const patientPhone = patient.phone || patient.contactNumber || "No Phone"

            if (appointment.patientName !== patientName) {
              updateData.patientName = patientName
            }

            if (appointment.patientPhone !== patientPhone) {
              updateData.patientPhone = patientPhone
            }
          }

          if (doctor && appointment.doctorName !== doctor.name) {
            updateData.doctorName = doctor.name
          }

          // Skip if no updates needed
          if (Object.keys(updateData).length === 0) continue

          // Update the appointment
          const response = await fetch(`http://localhost:5000/api/appointments/${appointment._id || appointment.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(localStorage.getItem("token")
                ? {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  }
                : {}),
            },
            body: JSON.stringify(updateData),
          })

          if (!response.ok) {
            throw new Error(`Error updating appointment ${appointment._id || appointment.id}`)
          }

          fixedCount++
        } catch (error) {
          console.error(`Error fixing appointment ${appointment._id || appointment.id}:`, error)
          errorCount++
        }
      }

      setResult({
        success: true,
        message: `Fixed ${fixedCount} appointments with ${errorCount} errors`,
      })

      toast({
        title: "Success",
        description: `Fixed ${fixedCount} appointments with ${errorCount} errors`,
      })
    } catch (error) {
      console.error("Error fixing appointments:", error)
      setResult({
        success: false,
        message: "Error fixing appointments",
      })

      toast({
        title: "Error",
        description: "Failed to fix appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Fixer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This tool will update existing appointments with correct patient and doctor names based on their IDs.
          </p>

          <div className="flex space-x-2">
            <Button onClick={fetchData} disabled={loading} variant="outline">
              Refresh Data
            </Button>
            <Button onClick={fixAppointments} disabled={loading}>
              Fix Appointments
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-md`}
            >
              <p className="font-semibold mb-2">{result.success ? "Success:" : "Error:"}</p>
              <p>{result.message}</p>
              {result.counts && (
                <div className="mt-2">
                  <p>Doctors: {result.counts.doctors}</p>
                  <p>Patients: {result.counts.patients}</p>
                  <p>Appointments: {result.counts.appointments}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
