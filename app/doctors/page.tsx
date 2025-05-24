"use client"

import Link from "next/link"
import Image from "next/image"
import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Phone, MapPin } from "lucide-react"
import { useData } from "@/context/data-context"
import { useState } from "react"

export default function DoctorList() {
  const { doctors } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor._id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Doctor List</h1>
            <p className="text-gray-500">{doctors.length} Doctors</p>
          </div>
          <Link href="/add-doctor">
            <Button className="bg-teal-600 hover:bg-teal-700">Add Doctor</Button>
          </Link>
        </div>

        <div className="mb-6 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search doctor by name or ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No doctors found. Add a new doctor to get started.</p>
            <Link href="/add-doctor" className="mt-4 inline-block">
              <Button className="bg-teal-600 hover:bg-teal-700">Add Doctor</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Link href={`/doctors/${doctor._id}`} key={doctor._id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt={doctor.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialty || doctor.department}</p>
                        <p className="text-sm text-gray-500">Experience: {doctor.experience}</p>

                        <div className="mt-3 space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{doctor.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {doctor.address}, {doctor.city}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

