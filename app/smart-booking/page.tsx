import { BookingForm } from "@/components/smart-booking/booking form"

export default function SmartBookingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Appointment Booking</h1>
        <p className="text-gray-500">Get AI-powered recommendations for your medical appointments</p>
      </div>

      <BookingForm />
    </div>
  )
}
