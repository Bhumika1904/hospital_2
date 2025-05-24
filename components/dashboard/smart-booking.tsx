"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function SmartBookingCard() {
  const router = useRouter()

  return (
    <Card className="border-2 border-teal-100 bg-gradient-to-br from-white to-teal-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-teal-700">
          <Brain className="h-5 w-5 mr-2 text-teal-600" />
          Smart Appointment Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600">
          Let AI analyze your symptoms and find the best doctor and time slot for your appointment.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => router.push("/smart-booking")}
        >
          Try Smart Booking <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
