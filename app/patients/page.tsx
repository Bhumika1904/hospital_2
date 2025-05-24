"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight } from "lucide-react"
import { useData } from "@/context/data-context"
import { useState } from "react"

export default function PatientList() {
  const { patients } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient._id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Patient List</h1>
            <p className="text-gray-500">{patients.length} Patients</p>
          </div>
          <Link href="/add-patient">
            <Button className="bg-teal-600 hover:bg-teal-700">Add Patient</Button>
          </Link>
        </div>

        <div className="mb-6 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Patient Name or Patient ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No patients found. Add a new patient to get started.</p>
            <Link href="/add-patient" className="mt-4 inline-block">
              <Button className="bg-teal-600 hover:bg-teal-700">Add Patient</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">PATIENT NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">AGE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">PHONE NUMBER</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ADDRESS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">CITY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">VISITS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium">{patient._id}</p>
                            <p>{patient.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{patient.age}</td>
                      <td className="py-3 px-4">{patient.phone}</td>
                      <td className="py-3 px-4">{patient.address}</td>
                      <td className="py-3 px-4">{patient.city}</td>
                      <td className="py-3 px-4">{patient.visits}</td>
                      <td className="py-3 px-4">
                        <Link href={`/patients/${patient._id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

