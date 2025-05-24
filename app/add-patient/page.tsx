"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useData } from "@/context/data-context"
import { useToast } from "@/components/ui/use-toast"
import { patientsApi } from "@/lib/api/patients"

export default function AddPatient() {
  const router = useRouter()
  const { refreshPatients } = useData()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    city: "",
    zipCode: "",
    allergies: "",
    currentMedication: "",
    pastMedicalHistory: "",
    emergencyContact: "",
    emergencyPhone: "",
    relationship: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setError(null) // Clear error when user makes changes
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    setError(null) // Clear error when user makes changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.age) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Create patient object
      const patient = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        age: Number.parseInt(formData.age),
        dateOfBirth: formData.dob ? new Date(formData.dob).toISOString() : undefined,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        allergies: formData.allergies,
        currentMedication: formData.currentMedication,
        pastMedicalHistory: formData.pastMedicalHistory,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        relationship: formData.relationship,
        visits: 0, // Initialize with 0 visits
      }

      console.log("Submitting patient data:", patient)

      // Use our updated API service
      const newPatient = await patientsApi.createPatient(patient)
      console.log("New patient created:", newPatient)

      // Refresh the patient list
      await refreshPatients()

      // Show success message
      toast({
        title: "Success",
        description: "Patient added successfully",
      })

      // Redirect to patient list
      router.push("/patients")
    } catch (error) {
      console.error("Error in form submission:", error)

      // Set detailed error message
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }

      toast({
        title: "Error",
        description: "Failed to add patient. See details below.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add Patient</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={formData.dob} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select onValueChange={(value) => handleSelectChange("bloodGroup", value)}>
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter city" value={formData.city} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" placeholder="Enter zip code" value={formData.zipCode} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Medical Information</h2>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      placeholder="Enter allergies (if any)"
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMedication">Current Medication</Label>
                    <Textarea
                      id="currentMedication"
                      placeholder="Enter current medication (if any)"
                      value={formData.currentMedication}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pastMedicalHistory">Past Medical History</Label>
                    <Textarea
                      id="pastMedicalHistory"
                      placeholder="Enter past medical history"
                      value={formData.pastMedicalHistory}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Enter emergency contact name"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      placeholder="Enter emergency contact phone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship to Patient</Label>
                    <Input
                      id="relationship"
                      placeholder="Enter relationship to patient"
                      value={formData.relationship}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Submitting..." : "Add Patient"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
