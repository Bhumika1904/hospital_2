"use client"

import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRound, Users, Calendar, Activity, ArrowUpRight } from 'lucide-react'
import { useData } from "@/context/data-context"
import Link from "next/link"
import { ConnectionTest } from "@/components/connection-test"

export default function Dashboard() {
  const { doctors, patients, appointments } = useData()
    function extractId(id: any): string {
    return typeof id === "object" && id !== null && "_id" in id ? id._id : id
  }
  // Calculate stats
  const totalDoctors = doctors.length
  const totalPatients = patients.length
  const totalAppointments = appointments.length
  const totalVisits = appointments.filter((a) => a.status === "Visited").length

  // Get recent appointments (last 4)
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <UserRound className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Link href="/doctors" className="text-teal-600 hover:underline">
                  View all doctors
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Link href="/patients" className="text-teal-600 hover:underline">
                  View all patients
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Link href="/appointments" className="text-teal-600 hover:underline">
                  View all appointments
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patient Visits</CardTitle>
              <Activity className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {totalAppointments > 0 ? Math.round((totalVisits / totalAppointments) * 100) : 0}%
                </span>
                completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => {
                  const patientId = extractId(appointment.patientId)
                  const doctorId = extractId(appointment.doctorId)
                    const patient = patients.find(patient => String(patient._id) === String(patientId));
                    const doctor = doctors.find(doctor =>String( doctor._id) === String(doctorId));
                     console.log("Appointment:", appointment);
                  console.log("Patients:", patients);
                  console.log("Doctors:", doctors);
                    return (
                      <div key={appointment._id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                            <UserRound className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium">Patient Name: {patient ? patient.name : `Not Found (ID: ${patientId})`}</p>
                            <p className="text-sm text-muted-foreground">Doctor Name: {doctor ? doctor.name : `Not Found (ID: ${appointment.doctorId})`}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {appointment.date}, {appointment.time}
                          </p>
                          <p
                            className={`text-xs ${
                              appointment.status === "Scheduled"
                                ? "text-amber-600"
                                : appointment.status === "Visited"
                                  ? "text-green-600"
                                  : "text-red-600"
                            }`}
                          >
                            {appointment.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No appointments yet</p>
                  <Link href="/add-appointment" className="mt-2 inline-block text-teal-600 hover:underline">
                    Book an appointment
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doctor Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.slice(0, 4).map((doctor, i) => (
                    <div key={doctor._id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <UserRound className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.department || doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">9:00 AM - 5:00 PM</p>
                        <p className={`text-xs ${i % 2 === 0 ? "text-green-600" : "text-amber-600"}`}>
                          {i % 2 === 0 ? "Available" : "Busy"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No doctors available</p>
                  <Link href="/add-doctor" className="mt-2 inline-block text-teal-600 hover:underline">
                    Add a doctor
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connection Test Component */}
        <div className="mt-8">
          <ConnectionTest />
        </div>
      </div>
    </DashboardLayout>
  )
}
