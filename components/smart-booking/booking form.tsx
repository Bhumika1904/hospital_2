"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedAppointmentRecommender } from "@/components/smart-booking/enhanced-appointment-recommender"
import { DoctorAvailability } from "./doctor-availability"

export function BookingForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    symptoms: "",
    medicalHistory: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription>Fill in your details or use our AI recommendation system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="smart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smart">Smart Booking</TabsTrigger>
            <TabsTrigger value="manual">Manual Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="smart">
            <EnhancedAppointmentRecommender />
          </TabsContent>

          <TabsContent value="manual">
            {/* Your existing manual booking form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                  </div>
                  {/* Rest of your form fields */}
                </div>
              </div>

              <DoctorAvailability />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}