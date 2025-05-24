import axios from "axios"

// Types for API responses
export interface DemandForecast {
  day: string
  morning: number
  afternoon: number
  evening: number
  predicted: boolean
}

export interface DoctorScheduleRecommendation {
  doctorId: string
  doctorName: string
  recommendedSlots: {
    day: string
    slots: string[]
  }[]
  reasoning: string
}

// API service for predictive scheduling
export const PredictiveSchedulingAPI = {
  // Fetch demand forecast from the API
  fetchDemandForecast: async (department: string, startDate: string): Promise<{ forecast: DemandForecast[] }> => {
    try {
      const response = await axios.post("/api/ai/predict-demand", {
        department,
        startDate,
      })
      return response.data
    } catch (error) {
      console.error("Error fetching demand forecast:", error)
      throw error
    }
  },

  // Fetch doctor schedule recommendations from the API
  fetchDoctorRecommendations: async (
    department: string,
    startDate: string,
  ): Promise<{ recommendations: DoctorScheduleRecommendation[] }> => {
    try {
      const response = await axios.post("/api/ai/recommend-schedules", {
        department,
        startDate,
      })
      return response.data
    } catch (error) {
      console.error("Error fetching doctor recommendations:", error)
      throw error
    }
  },
}
