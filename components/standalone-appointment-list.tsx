"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Clock, UserRound, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export function StandaloneAppointmentList() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      // Direct fetch to backend API
      const response = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Raw appointments data:", data)

      // Process the data to ensure all fields exist
      const processedAppointments = (Array.isArray(data) ? data : data.appointments || []).map((appointment: any) => ({
        id: appointment._id || appointment.id || "unknown-id",
        patientId: appointment.patientId || "unknown-patient",
        patientName: appointment.patientName || "Unknown Patient",
        patientPhone: appointment.patientPhone || "No Phone",
        doctorId: appointment.doctorId || "unknown-doctor",
        doctorName: appointment.doctorName || "Unknown Doctor",
        date: appointment.date || "No Date",
        time: appointment.time || "No Time",
        status: appointment.status || "Scheduled",
        symptoms: appointment.symptoms || "",
        createdAt: appointment.createdAt || new Date().toISOString(),
      }))

      console.log("Processed appointments:", processedAppointments)
      setAppointments(processedAppointments)
    } catch (err: any) {
      console.error("Error fetching appointments:", err)
      setError(err.message || "Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update appointment status")
      }

      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}`,
      })

      // Refresh data
      fetchAppointments()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        <Button onClick={fetchAppointments} className="mt-2">
          Try Again
        </Button>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground mb-2">No appointments found</p>
          <Button onClick={fetchAppointments} className="mt-2">
            Refresh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <Button onClick={fetchAppointments} disabled={loading} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 md:mb-0">
                      <UserRound className="h-5 w-5 text-teal-600 mr-2" />
                      <div>
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <p className="text-sm text-muted-foreground">Patient ID: {appointment.patientId}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        appointment.status === "Scheduled"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : appointment.status === "Visited"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                      <p className="font-medium">{appointment.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p>{appointment.patientPhone}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-teal-600 mr-1" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-teal-600 mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Symptoms</p>
                      <p className="text-sm">{appointment.symptoms}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 md:p-6 md:w-64 flex flex-row md:flex-col justify-between md:justify-start">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Appointment ID</p>
                    <p className="text-sm font-mono">{appointment.id}</p>
                  </div>

                  <div className="space-y-2">
                    {appointment.status !== "Visited" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => updateAppointmentStatus(appointment.id, "Visited")}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Visited
                      </Button>
                    )}

                    {appointment.status !== "Cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => updateAppointmentStatus(appointment.id, "Cancelled")}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Appointment
                      </Button>
                    )}

                    {appointment.status === "Cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                        onClick={() => updateAppointmentStatus(appointment.id, "Scheduled")}
                        disabled={isUpdating}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
