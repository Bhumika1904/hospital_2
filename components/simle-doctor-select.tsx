"use client"

import { useEffect } from "react"
import { useData } from "@/context/data-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimpleDoctorSelectProps {
  value: string
  onChange: (value: string) => void
}

export function SimpleDoctorSelect({ value, onChange }: SimpleDoctorSelectProps) {
  const { doctors, isLoading } = useData()

  useEffect(() => {
    console.log("SimpleDoctorSelect - Available doctors:", doctors)
    console.log("SimpleDoctorSelect - Current value:", value)
  }, [doctors, value])

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Doctor" />
      </SelectTrigger>
      <SelectContent>
        {doctors.length === 0 && (
          <SelectItem value="loading" disabled>
            {isLoading ? "Loading doctors..." : "No doctors available"}
          </SelectItem>
        )}
        {doctors.map((doctor) => (
          <SelectItem key={doctor._id} value={doctor._id}>
            {doctor.name} - {doctor.specialty}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
