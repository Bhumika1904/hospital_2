"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useData } from "@/context/data-context"
import {
  Calendar,
  Clock,
  UserRound,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppointmentsPage() {
  const { toast } = useToast()
  const { appointments, doctors, fetchData } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Scheduled" | "Visited" | "Cancelled">("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [doctorFilter, setDoctorFilter] = useState<string>("all")
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await fetchData()
      setDataReady(true)
    }
    loadData()
  }, [fetchData])

  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: "Scheduled" | "Visited" | "Cancelled",
  ) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        {
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
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update appointment status")
      }

      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}`,
      })

      await fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter appointments by search term and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (appointment.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate = dateFilter === "all" || appointment.date === dateFilter
    const matchesDoctor = doctorFilter === "all" || appointment.doctorId === doctorFilter

    return matchesSearch && matchesStatus && matchesDate && matchesDoctor
  })

  const uniqueDates = [...new Set(appointments.map((a) => a.date))].sort()

  const statusCounts = {
    all: appointments.length,
    Scheduled: appointments.filter((a) => a.status === "Scheduled").length,
    Visited: appointments.filter((a) => a.status === "Visited").length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  }

  if (!dataReady) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="flex mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={() => fetchData()}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Link href="/add-appointment" passHref>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-1" />
                New Appointment
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="Scheduled" onClick={() => setStatusFilter("Scheduled")}>
              Scheduled ({statusCounts.Scheduled})
            </TabsTrigger>
            <TabsTrigger value="Visited" onClick={() => setStatusFilter("Visited")}>
              Visited ({statusCounts.Visited})
            </TabsTrigger>
            <TabsTrigger value="Cancelled" onClick={() => setStatusFilter("Cancelled")}>
              Cancelled ({statusCounts.Cancelled})
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All doctors</SelectItem>
                {doctors
                  .filter((doctor) => doctor?.name)
                  .map((doctor) => {
                    const doctorId = doctor._id?.toString() || doctor._id?.toString() || `doctor-${Math.random()}`
                    return (
                      <SelectItem key={doctorId} value={doctorId}>
                        {doctor.name}
                      </SelectItem>
                    )
                  })}
              </SelectContent>
            </Select>
          </div>

          {/* Show filtered appointments */}
          <TabsContent value="all" className="mt-0">
            <AppointmentsList
              appointments={filteredAppointments}
              updateStatus={updateAppointmentStatus}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="Scheduled" className="mt-0">
            <AppointmentsList
              appointments={filteredAppointments}
              updateStatus={updateAppointmentStatus}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="Visited" className="mt-0">
            <AppointmentsList
              appointments={filteredAppointments}
              updateStatus={updateAppointmentStatus}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="Cancelled" className="mt-0">
            <AppointmentsList
              appointments={filteredAppointments}
              updateStatus={updateAppointmentStatus}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  department: string;
}
interface Appointment {
  _id?: string
  id?: string
  patientId?: Patient // ✅ Add this line
  doctorId?: Doctor
  date?: string
  time?: string
  status?: "Scheduled" | "Visited" | "Cancelled" | string
}

interface AppointmentsListProps {
  appointments: Appointment[]
  updateStatus: (appointmentId: string, newStatus:"Scheduled" | "Visited" | "Cancelled") => Promise<void>
  isLoading: boolean
}

function AppointmentsList({ appointments, updateStatus, isLoading }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-muted-foreground">
          No appointments found.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const patientName = appointment.patientId?.name  || "Unknown Patient"
        const doctorName = appointment.doctorId?.name  || "Unknown Doctor"
        const appointmentDate = appointment.date || "Unknown Date"
        const appointmentTime = appointment.time || "Unknown Time"
        const appointmentStatus = appointment.status || "Scheduled"
        const appointmentId = appointment._id?.toString() || appointment._id?.toString() || ""

        return (
          <Card key={appointmentId}>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{patientName}</h3>
                <Badge
                  variant={
                    appointmentStatus === "Scheduled"
                      ? "secondary"
                      : appointmentStatus === "Visited"
                      ? "secondary"
                      : appointmentStatus === "Cancelled"
                      ? "destructive"
                      : "default"
                  }
                >
                  {appointmentStatus}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground space-x-4 mb-2">
                <UserRound className="h-4 w-4" />
                <span>{doctorName}</span>
              </div>
              <div className="flex items-center text-muted-foreground space-x-4 mb-2">
                <Calendar className="h-4 w-4" />
                <span>{appointmentDate}</span>
                <Clock className="h-4 w-4" />
                <span>{appointmentTime}</span>
              </div>
              <div className="flex space-x-2">
                {appointmentStatus !== "Visited" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => updateStatus(appointmentId, "Visited")}
                    className="flex items-center"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Mark Visited
                  </Button>
                )}
                {appointmentStatus !== "Cancelled" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoading}
                    onClick={() => updateStatus(appointmentId, "Cancelled")}
                    className="flex items-center"
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
