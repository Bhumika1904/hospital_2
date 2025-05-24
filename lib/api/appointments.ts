import api from "./axios"
import axios from "axios" // Import axios directly
import type { Appointment } from "@/context/data-context"

export const appointmentsApi = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get("/appointments")
      console.log("API Response (Appointments):", response.data)

      // Process the appointments to ensure they have all required fields
      const appointments = Array.isArray(response.data) ? response.data : response.data.appointments || []

      // Ensure each appointment has the required fields
      return appointments.map((appointment:any) => ({
        ...appointment,
        id: appointment._id || appointment.id,
        patientName: appointment.patientName || "Unknown Patient",
        patientPhone: appointment.patientPhone || "No Phone",
        doctorName: appointment.doctorName || "Unknown Doctor",
        status: appointment.status || "Scheduled",
      }))
    } catch (error) {
      console.error("Error fetching appointments:", error)
      return []
    }
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response.data.appointment || response.data
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error)
      throw error
    }
  },

  createAppointment: async (appointmentData: any): Promise<Appointment> => {
    try {
      console.log("Creating appointment with data:", appointmentData)

      // Ensure all required fields are present
      const formattedData = {
        ...appointmentData,
        doctorId: String(appointmentData.doctorId),
        patientId: String(appointmentData.patientId),
        // Explicitly include these fields
        patientName: appointmentData.patientName,
        patientPhone: appointmentData.patientPhone,
        doctorName: appointmentData.doctorName,
      }

      console.log("Formatted appointment data:", formattedData)

      // Try with direct axios call to bypass any interceptors
      const response = await axios.post("http://localhost:5000/api/appointments", formattedData, {
        headers: {
          "Content-Type": "application/json",
          // Add token if available
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
      })

      console.log("Create appointment response:", response.data)
      return response.data.appointment || response.data
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      console.error("Error response:", error.response?.data)
      throw new Error(error.response?.data?.message || "Failed to create appointment")
    }
  },

  updateAppointment: async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData)
      return response.data.appointment || response.data
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error)
      throw error
    }
  },

  updateAppointmentStatus: async (id: string, status: "Scheduled" | "Visited" | "Cancelled"): Promise<Appointment> => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status })
      return response.data.appointment || response.data
    } catch (error) {
      console.error(`Error updating appointment status ${id}:`, error)
      throw error
    }
  },

  deleteAppointment: async (id: string) => {
    try {
      const response = await api.delete(`/appointments/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error)
      throw error
    }
  },

  getAvailableTimeSlots: async (doctorId: string, date: string) => {
    try {
      const response = await api.get(`/appointments/available-slots/${doctorId}/${date}`)
      return response.data.availableSlots || []
    } catch (error) {
      console.error(`Error fetching available slots for doctor ${doctorId}:`, error)
      return []
    }
  },
}
