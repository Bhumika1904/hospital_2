"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, Clock, User, AlertCircle, Check } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai" 

// Initialize the Gemini API
// In production, use environment variables for the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

interface Doctor {
  id: string
  name: string
  department: string
  specialist: string
  experience: number
}

interface RecommendationResult {
  recommendedDoctor: {
    id: string
    name: string
    department: string
  }
  recommendedTimeSlot: string
  recommendedDate: string
  priority: "normal" | "urgent" | "emergency"
  reasoning: string
}

export function AppointmentRecommender() {
  const [loading, setLoading] = useState(false)
  const [patientSymptoms, setPatientSymptoms] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  // Mock doctors data - in a real app, this would come from your backend
  const doctors: Doctor[] = [
    { id: "1", name: "Dr. Sarah Johnson", department: "Cardiology", specialist: "Heart Disease", experience: 10 },
    { id: "2", name: "Dr. Michael Chen", department: "Neurology", specialist: "Stroke", experience: 8 },
    { id: "3", name: "Dr. Emily Rodriguez", department: "Pediatrics", specialist: "Child Development", experience: 12 },
    { id: "4", name: "Dr. David Kim", department: "Orthopedics", specialist: "Sports Injuries", experience: 15 },
    { id: "5", name: "Dr. Lisa Patel", department: "Dermatology", specialist: "Skin Cancer", experience: 7 },
  ]

  const getRecommendation = async () => {
    if (!patientSymptoms || !patientAge || !patientGender) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)
    setBookingConfirmed(false)

    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      // Format the prompt for Gemini
      const prompt = `
        As an AI medical appointment scheduler, analyze the following patient information and available doctors to recommend the optimal doctor and appointment time:
        
        Patient Information:
        - Symptoms: ${patientSymptoms}
        - Age: ${patientAge}
        - Gender: ${patientGender}
        
        Available Doctors:
        ${JSON.stringify(doctors)}
        
        Based on this information:
        1. Determine which doctor would be most appropriate for this patient
        2. Recommend an optimal time slot (morning or evening)
        3. Suggest a date (today, tomorrow, or specific date)
        4. Assess the priority level of this appointment (normal, urgent, emergency)
        5. Provide reasoning for your recommendations
        
        Format your response as a valid JSON object with the following structure:
        {
          "recommendedDoctor": {
            "id": "doctor_id",
            "name": "doctor_name",
            "department": "department"
          },
          "recommendedTimeSlot": "time_slot",
          "recommendedDate": "date",
          "priority": "normal|urgent|emergency",
          "reasoning": "detailed reasoning"
        }
      `

      // Generate content with Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract the JSON from the response
      // Find JSON object in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

      // Parse the JSON response
      const recommendationData = JSON.parse(jsonString)
      setRecommendation(recommendationData)
    } catch (err) {
      console.error("AI recommendation error:", err)
      setError("Error generating recommendation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const confirmBooking = () => {
    // In a real app, you would send this to your backend
    setBookingConfirmed(true)
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
              onClick={getRecommendation}
              disabled={loading || !patientSymptoms || !patientAge || !patientGender}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing and Finding Best Options...
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

      {recommendation && !bookingConfirmed && (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendation</CardTitle>
            <CardDescription>Optimal appointment based on your information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-md ${
                  recommendation.priority === "emergency"
                    ? "bg-red-50"
                    : recommendation.priority === "urgent"
                      ? "bg-amber-50"
                      : "bg-green-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      recommendation.priority === "emergency"
                        ? "bg-red-200 text-red-800"
                        : recommendation.priority === "urgent"
                          ? "bg-amber-200 text-amber-800"
                          : "bg-green-200 text-green-800"
                    }`}
                  >
                    {recommendation.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Recommended Doctor</span>
                  </div>
                  <p className="text-lg font-bold">{recommendation.recommendedDoctor.name}</p>
                  <p className="text-sm text-gray-500">{recommendation.recommendedDoctor.department}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Recommended Date</span>
                  </div>
                  <p className="text-lg font-bold">{recommendation.recommendedDate}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Recommended Time</span>
                  </div>
                  <p className="text-lg font-bold">{recommendation.recommendedTimeSlot}</p>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">AI Reasoning</h3>
                <p className="text-sm">{recommendation.reasoning}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={confirmBooking} className="w-full">
              Book This Appointment
            </Button>
          </CardFooter>
        </Card>
      )}

      {bookingConfirmed && (
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
                  <p className="text-lg font-bold">{recommendation?.recommendedDoctor.name}</p>
                  <p className="text-sm text-gray-500">{recommendation?.recommendedDoctor.department}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="text-lg font-bold">{recommendation?.recommendedDate}</p>
                </div>

                <div className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="text-lg font-bold">{recommendation?.recommendedTimeSlot}</p>
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
