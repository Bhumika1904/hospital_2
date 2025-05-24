"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { patientsApi } from "@/lib/api/patients"

// Types
export type Doctor = {
  _id: string
  name: string
  specialty: string
  experience: string
  phone: string
  address: string
  city: string
  email: string
  dateOfJoining?: string
  bloodGroup?: string
  dateOfBirth?: string
  specialist?: string
  designation?: string
  department?: string
  education?: string
  gender?: string
  age: string
  workExperience: string
}

export type Patient = {
  _id: string
  name?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender: string
  contactNumber?: string
  phone?: string
  address: string
  age: number
  city?: string
  visits: number
  email?: string
  bloodGroup?: string
  allergies?: string
  currentMedication?: string
  pastMedicalHistory?: string
  emergencyContact?: string
  emergencyPhone?: string
  relationship?: string
}

export type Appointment = {
  _id: string
  patientId: string
  patientName: string
  patientPhone: string
  symptoms: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  status: "Scheduled" | "Visited" | "Cancelled"
  createdAt: string
}

// Context Type
type DataContextType = {
  doctors: Doctor[]
  patients: Patient[]
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  fetchData: () => Promise<void>
  refreshPatients: () => Promise<void>
  addPatient: (patientData: Omit<Patient, "id" | "visits">) => Promise<{ success: boolean; error?: string }>
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<{ success: boolean; error?: string }>
  deletePatient: (id: string) => Promise<{ success: boolean; error?: string }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const headers: HeadersInit = getAuthHeaders()

      const doctorsResponse = await fetch("http://localhost:5000/api/doctors", { headers })
      const doctorsData = await doctorsResponse.json()
      const safeDocData = Array.isArray(doctorsData)
        ? doctorsData
        : Array.isArray(doctorsData.doctors)
          ? doctorsData.doctors
          : []

      const patientsResponse = await fetch("http://localhost:5000/api/patients", { headers })
      const patientsData = await patientsResponse.json()
      const safePatientsData = Array.isArray(patientsData)
        ? patientsData
        : Array.isArray(patientsData.patients)
          ? patientsData.patients
          : []

      const appointmentsResponse = await fetch("http://localhost:5000/api/appointments", { headers })
      const appointmentsData = await appointmentsResponse.json()
      const safeAppointmentsData = Array.isArray(appointmentsData)
        ? appointmentsData
        : Array.isArray(appointmentsData.appointments)
          ? appointmentsData.appointments
          : []

      setDoctors(safeDocData)
      setPatients(safePatientsData)

      const doctorMap = new Map<string, Doctor>()
      safeDocData.forEach((doctor: Doctor) => {
        const id = doctor._id
        if (id) doctorMap.set(id, doctor)
      })

      const patientMap = new Map<string, Patient>()
      safePatientsData.forEach((patient: Patient) => {
        const id = patient._id
        if (id) patientMap.set(id, patient)
      })

      const enrichedAppointments: Appointment[] = safeAppointmentsData
        .map((appointment: any): Appointment | null => {
          const patient = patientMap.get(appointment.patientId)
          const doctor = doctorMap.get(appointment.doctorId)

          const patientName =
            patient?.name ||
            `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() ||
            "Unknown Patient"
          const patientPhone =
            patient?.phone || patient?.contactNumber || "No Phone"
          const doctorName = doctor?.name || "Unknown Doctor"

          return {
            ...appointment,
            id: appointment._id || appointment.id,
            patientName,
            patientPhone,
            doctorName,
          }
        })
        .filter(Boolean) as Appointment[]

      setAppointments(enrichedAppointments)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPatients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await patientsApi.getAllPatients()
      setPatients(data || [])
      await fetchData()
    } catch (err) {
      console.error("Error refreshing patients:", err)
      setError("Failed to refresh patients.")
    } finally {
      setIsLoading(false)
    }
  }

  const addPatient = async (patientData: Omit<Patient, "id" | "visits">) => {
    try {
      const patientWithVisits = { ...patientData, visits: 0 }
      const newPatient = await patientsApi.createPatient(
        patientWithVisits as Omit<Patient, "id">
      )
      setPatients((prev) => [...prev, newPatient])
      setTimeout(() => fetchData(), 500)
      return { success: true }
    } catch (err) {
      console.error("Error adding patient:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add patient",
      }
    }
  }

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    try {
      const updatedPatient = await patientsApi.updatePatient(id, patientData)
      setPatients((prev) => prev.map((p) => (p._id === id ? updatedPatient : p)))
      await fetchData()
      return { success: true }
    } catch (err) {
      console.error("Error updating patient:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update patient",
      }
    }
  }

  const deletePatient = async (id: string) => {
    try {
      await patientsApi.deletePatient(id)
      setPatients((prev) => prev.filter((p) => p._id !== id))
      await fetchData()
      return { success: true }
    } catch (err) {
      console.error("Error deleting patient:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete patient",
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataContext.Provider
      value={{
        doctors,
        patients,
        appointments,
        isLoading,
        error,
        fetchData,
        refreshPatients,
        addPatient,
        updatePatient,
        deletePatient,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
