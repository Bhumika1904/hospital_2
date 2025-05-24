"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useData } from "@/context/data-context"

interface DoctorSelectProps {
  value: string
  onChange: (value: string) => void
}

export function DoctorSelect({ value, onChange }: DoctorSelectProps) {
  const [open, setOpen] = useState(false)
  const { doctors, isLoading } = useData()

  // Debug output
  useEffect(() => {
    console.log("DoctorSelect - Available doctors:", doctors)
    console.log("DoctorSelect - Current value:", value)
  }, [doctors, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {value && doctors.length > 0
            ? doctors.find((doctor) => doctor._id === value)?.name || "Select Doctor"
            : "Select Doctor"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search doctor..." />
          <CommandList>
            <CommandEmpty>{isLoading ? "Loading doctors..." : "No doctor found."}</CommandEmpty>
            <CommandGroup>
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor._id}
                  value={doctor._id}
                  onSelect={(currentValue) => {
                    console.log("Doctor selected:", currentValue, doctor)
                    onChange(doctor._id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === doctor._id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{doctor.name}</span>
                    <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
