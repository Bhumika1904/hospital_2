"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Clock, User, AlertCircle, Check } from 'lucide-react'
import { fetchDoctors, getAppointmentRecommendation, type Doctor, type RecommendationResult } from "@/lib/api/api-service"

export function EnhancedAppointmentRecommender() {
  const [loading, setLoading] = useState(false)
  const [patientSymptoms, setPatientSymptoms] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationResult | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)

  // Fetch doctors when component mounts
  useEffect(() => {
    const getDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const doctorsData = await fetchDoctors()
        setDoctors(doctorsData)
      } catch (err) {
        console.error("Error fetching doctors:", err)
      } finally {
        setLoadingDoctors(false)
      }
    }

    getDoctors()
  }, [])

  const getRecommendations = async () => {
    if (!patientSymptoms || !patientAge || !patientGender) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)
    setBookingConfirmed(false)
    setRecommendations([])
    setSelectedRecommendation(null)

    try {
      // Call your backend API
      const mainRecommendation = await getAppointmentRecommendation({
        symptoms: patientSymptoms,
        age: patientAge,
        gender: patientGender,
      })

      if (!mainRecommendation) {
        throw new Error("Failed to get recommendations")
      }

      // Add confidence scores if not present
      const enhancedRecommendation = {
        ...mainRecommendation,
        confidence: mainRecommendation.confidence || 0.95,
      }

      // Find a different doctor for the second recommendation
      const alternativeDoctorId = doctors.find(
        (d) => d._id !== mainRecommendation.recommendedDoctor.id
      )?._id

      // Create a second recommendation with a different doctor
      let secondRecommendation: RecommendationResult | null = null
      
      if (alternativeDoctorId) {
        const alternativeDoctor = doctors.find((d) => d._id === alternativeDoctorId)
        
        if (alternativeDoctor) {
          secondRecommendation = {
            ...enhancedRecommendation,
            recommendedDoctor: {
              id: alternativeDoctor._id,
              name: `Dr. ${alternativeDoctor.firstName} ${alternativeDoctor.lastName}`,
              department: alternativeDoctor.department,
            },
            recommendedTimeSlot: enhancedRecommendation.recommendedTimeSlot.includes("AM")
              ? enhancedRecommendation.recommendedTimeSlot.replace("AM", "PM")
              : enhancedRecommendation.recommendedTimeSlot.replace("PM", "AM"),
            confidence: 0.75,
            reasoning: `Alternative option with Dr. ${alternativeDoctor.firstName} ${alternativeDoctor.lastName} who also has expertise relevant to your symptoms.`,
          }
        }
      }

      const recommendationsArray = [enhancedRecommendation]
      if (secondRecommendation) {
        recommendationsArray.push(secondRecommendation)
      }

      setRecommendations(recommendationsArray)
      setSelectedRecommendation(enhancedRecommendation)
    } catch (err) {
      console.error("AI recommendation error:", err)
      setError("Error generating recommendation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const confirmBooking = () => {
    // In a real app, you would send this to your backend
    // For example:
    // const bookAppointment = async () => {
    //   try {
    //     const response = await fetch(`${API_URL}/appointments`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         doctorId: selectedRecommendation?.recommendedDoctor.id,
    //         date: selectedRecommendation?.recommendedDate,
    //         time: selectedRecommendation?.recommendedTimeSlot,
    //         symptoms: patientSymptoms,
    //         patientAge: patientAge,
    //         patientGender: patientGender,
    //       }),
    //     });
    //     
    //     if (!response.ok) {
    //       throw new Error('Failed to book appointment');
    //     }
    //     
    //     setBookingConfirmed(true);
    //   } catch (error) {
    //     setError('Failed to book appointment. Please try again.');
    //   }
    // };
    // 
    // bookAppointment();

    // For demo purposes, just set booking confirmed
    setBookingConfirmed(true)
  }

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.9) return "border-l-green-500"
    if (confidence >= 0.7) return "border-l-yellow-500"
    return "border-l-gray-300"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Appointment Booking</CardTitle>
          <CardDescription>Let AI recommend the best doctor and time slot based on your symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Your Symptoms *</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms in detail"
                value={patientSymptoms}
                onChange={(e) => setPatientSymptoms(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Your Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Your Gender *</Label>
                <Select value={patientGender} onValueChange={setPatientGender}>
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
            </div>

            <Button
              onClick={getRecommendations}
              disabled={loading || loadingDoctors || !patientSymptoms || !patientAge || !patientGender}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing and Finding Best Options...
                </>
              ) : loadingDoctors ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Doctors...
                </>
              ) : (
                "Get AI Recommendation"
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && !bookingConfirmed && (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Optimal appointments based on your information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-md ${
                  selectedRecommendation?.priority === "emergency"
                    ? "bg-red-50"
                    : selectedRecommendation?.priority === "urgent"
                      ? "bg-amber-50"
                      : "bg-green-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      selectedRecommendation?.priority === "emergency"
                        ? "bg-red-200 text-red-800"
                        : selectedRecommendation?.priority === "urgent"
                          ? "bg-amber-200 text-amber-800"
                          : "bg-green-200 text-green-800"
                    }`}
                  >
                    {selectedRecommendation?.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${getConfidenceBadgeColor(rec.confidence || 0.7)} cursor-pointer ${
                      selectedRecommendation === rec ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center">
                        <User className="h-4 w-4 text-primary mr-2" />
                        {rec.recommendedDoctor.name}
                      </CardTitle>
                      <CardDescription>{rec.recommendedDoctor.department}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 text-sm">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        {rec.recommendedDate}
                      </div>
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        {rec.recommendedTimeSlot}
                      </div>
                      <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Badge className="ml-auto">Confidence: {Math.round((rec.confidence || 0.7) * 100)}%</Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Button onClick={confirmBooking} className="w-full mt-4">
                Book Selected Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {bookingConfirmed && selectedRecommendation && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="text-green-700">Appointment Confirmed!</CardTitle>
            <CardDescription className="text-green-600">Your appointment has been successfully booked</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Doctor</span>
                  </div>
                  <p className="text-lg font-bold">{selectedRecommendation.recommendedDoctor.name}</p>
                  <p className="text-sm text-gray-500">{selectedRecommendation.recommendedDoctor.department}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="text-lg font-bold">{selectedRecommendation.recommendedDate}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="text-lg font-bold">{selectedRecommendation.recommendedTimeSlot}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  Please arrive 15 minutes before your appointment time. Don't forget to bring your ID and insurance
                  card.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Add to Calendar
            </Button>
            <Button className="flex-1">View Appointment Details</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}