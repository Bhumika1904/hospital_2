// API service for smart booking functionality

export interface Doctor {
  _id: string
  firstName: string
  lastName: string
  name?: string
  department: string
  specialist?: string
  specialty?: string
  experience?: number
}

export interface RecommendationResult {
  recommendedDoctor: {
    id: string
    name: string
    department: string
  }
  recommendedTimeSlot: string
  recommendedDate: string
  priority: "normal" | "urgent" | "emergency"
  reasoning: string
  confidence: number
}

// Fetch doctors from the API
export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch("http://localhost:5000/api/doctors")
    if (!response.ok) {
      throw new Error("Failed to fetch doctors")
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching doctors:", error)
    // Return mock data if API call fails
    return [
      { _id: "1", firstName: "Sarah", lastName: "Johnson", department: "Cardiology", specialty: "Heart Disease" },
      { _id: "2", firstName: "Michael", lastName: "Chen", department: "Neurology", specialty: "Stroke" },
      { _id: "3", firstName: "Emily", lastName: "Rodriguez", department: "Pediatrics", specialty: "Child Development" },
      { _id: "4", firstName: "David", lastName: "Kim", department: "Orthopedics", specialty: "Sports Injuries" },
      { _id: "5", firstName: "Lisa", lastName: "Patel", department: "Dermatology", specialty: "Skin Cancer" },
    ]
  }
}

// Get AI appointment recommendation
export async function getAppointmentRecommendation(patientData: {
  symptoms: string
  age: string
  gender: string
}): Promise<RecommendationResult> {
  try {
    const response = await fetch("http://localhost:5000/api/gemini/recommend-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    })

    if (!response.ok) {
      throw new Error("Failed to get recommendation")
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error getting recommendation:", error)

    // Return mock data if API call fails
    // This ensures the UI can still function for demonstration purposes
    return {
      recommendedDoctor: {
        id: "2",
        name: "Dr. Michael Chen",
        department: "Neurology",
      },
      recommendedTimeSlot: "10:30 AM",
      recommendedDate: "Tomorrow",
      priority: "normal",
      reasoning:
        "Based on the symptoms described, a neurological consultation is recommended. Dr. Chen specializes in these types of cases and has morning availability.",
      confidence: 0.92,
    }
  }
}
