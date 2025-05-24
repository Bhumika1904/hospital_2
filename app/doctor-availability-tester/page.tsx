import { DashboardLayout } from "@/components/layout"
import { DoctorAvailabilityTester } from "@/components/doctor-availability-tester"
import { ForceAppointmentCreator } from "@/components/force-appointment-creator"

export default function DoctorAvailabilityPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Doctor Availability</h1>
        <p className="text-muted-foreground">
          Use this page to test doctor availability for different time slots and create appointments that bypass
          availability checks if needed.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Important Information</h2>
          <p className="text-yellow-700 mb-2">
            If you're getting "doctor is not available at this time" errors, you can:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
            <li>Use the availability tester below to find times when the doctor is available</li>
            <li>Use the force appointment creator to bypass availability checks</li>
            <li>Try different dates and times until you find one that works</li>
          </ol>
        </div>

        <DoctorAvailabilityTester />

        <ForceAppointmentCreator />
      </div>
    </DashboardLayout>
  )
}
