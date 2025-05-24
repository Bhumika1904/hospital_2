"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Clock, CheckCircle2 } from "lucide-react"

interface Doctor {
  id: string
  name: string
  department: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export function DoctorAvailability() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  // Mock doctors data
  const doctors: Doctor[] = [
    { id: "1", name: "Dr. Sarah Johnson", department: "Cardiology" },
    { id: "2", name: "Dr. Michael Chen", department: "Neurology" },
    { id: "3", name: "Dr. Emily Rodriguez", department: "Pediatrics" },
    { id: "4", name: "Dr. David Kim", department: "Orthopedics" },
    { id: "5", name: "Dr. Lisa Patel", department: "Dermatology" },
  ]

  // Generate time slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailability()
    }
  }, [selectedDoctor, selectedDate])

  const fetchAvailability = async () => {
    setLoading(true)
    setSelectedTimeSlot(null)

    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll generate random availability
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const morningSlots = [
        "9:00 AM",
        "9:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
      ]

      const eveningSlots = [
        "4:30 PM",
        "5:00 PM",
        "5:30 PM",
        "6:00 PM",
        "6:30 PM",
        "7:00 PM",
        "7:30 PM",
        "8:00 PM",
        "8:30 PM",
      ]

      const allSlots = [...morningSlots, ...eveningSlots]

      // Generate random availability
      const availableSlots = allSlots.map((time) => ({
        time,
        available: Math.random() > 0.3, // 70% chance of being available
      }))

      setTimeSlots(availableSlots)
    } catch (error) {
      console.error("Error fetching availability:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Availability</CardTitle>
        <CardDescription>Check available time slots and book your appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md p-3"
              disabled={(date) => {
                // Disable past dates and weekends
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const day = date.getDay()
                return date < today || day === 0 || day === 6
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Available Time Slots</Label>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                    className={`justify-start ${!slot.available && "opacity-50 cursor-not-allowed"}`}
                    disabled={!slot.available}
                    onClick={() => handleTimeSlotSelect(slot.time)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {slot.time}
                    {selectedTimeSlot === slot.time && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {selectedDoctor ? "No time slots available" : "Select a doctor and date to view availability"}
              </div>
            )}
          </div>

          {selectedTimeSlot && <Button className="w-full">Book Appointment for {selectedTimeSlot}</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
