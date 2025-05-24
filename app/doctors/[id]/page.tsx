"use client";

import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MapPin, User, Calendar, Edit, Eye } from "lucide-react";
import { useData } from "@/context/data-context";

// Define types
type Doctor = {
  id: string;
  name: string;
  age: string;
  phone: string;
  address: string;
  city: string;
  dateOfJoining: string;
  bloodGroup: string;
  dateOfBirth: string;
  specialist: string;
  designation: string;
  email: string;
  department: string;
  workExperience: string;
  education: string;
};

type Appointment = {
  id: string;
  date: string;
  patientName: string;
  doctorId: string;
  status: string;
};

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const { doctors, appointments } = useData();

  console.log("Doctors Data:", doctors); // Debugging line

  // Find doctor by ID
  const doctor = doctors.find((doc) => doc._id === params.id);
  if (!doctor) {
    return <div>Doctor not found</div>; // You could also redirect here
  }
  // Filter appointments for this doctor
  const doctorAppointments: Appointment[] = appointments.filter(
    (appointment) => appointment.doctorId === params.id
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{doctor.name}</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Link href="/add-appointment">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Calendar className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Profile Card */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt={doctor.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p className="text-gray-500">{doctor.department}</p>
                <p className="text-gray-500">{doctor.designation}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-400" />
                    <p className="font-medium">{doctor.age}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                    <p className="font-medium">{doctor.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <p className="font-medium">{doctor.address}, {doctor.city}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Personal & Appointment Details */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <Tabs defaultValue="personal">
                <TabsList>
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="appointment">Appointment Details</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                {/* Personal Details */}
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p className="font-medium">Date of Joining: {doctor.dateOfJoining}</p>
                    <p className="font-medium">Blood Group: {doctor.bloodGroup}</p>
                    <p className="font-medium">Date of Birth: {doctor.dateOfBirth}</p>
                    <p className="font-medium">Email: {doctor.email}</p>
                    <p className="font-medium">Specialist: {doctor.specialist}</p>
                    <p className="font-medium">Department: {doctor.department}</p>
                    <p className="font-medium">Designation: {doctor.designation}</p>
                    <p className="font-medium">Work Experience: {doctor.workExperience}</p>
                    <p className="font-medium">Education: {doctor.education}</p>
                  </div>
                </TabsContent>

                {/* Appointment Details */}
                <TabsContent value="appointment">
                  {doctorAppointments.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">DATE</th>
                          <th className="py-3 px-4 text-left">PATIENT</th>
                          <th className="py-3 px-4 text-left">STATUS</th>
                          <th className="py-3 px-4 text-left">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorAppointments.map((appointment: Appointment) => (
                          <tr key={appointment.id} className="border-b">
                            <td className="py-3 px-4">{appointment.date}</td>
                            <td className="py-3 px-4">{appointment.patientName}</td>
                            <td className="py-3 px-4">{appointment.status}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center py-6">No appointments found for this doctor.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
