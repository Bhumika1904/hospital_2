import { DashboardLayout } from "@/components/layout"
import { DirectAppointmentCreator } from "@/components/direct-appointment"

export default function CreateDirectAppointmentPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create Direct Appointment</h1>
        <p className="text-muted-foreground">
          This form creates appointments with all fields explicitly set to ensure they display correctly.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Important Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
            <li>Select a patient and doctor from the dropdown menus</li>
            <li>The form will automatically fill in the patient and doctor IDs and names</li>
            <li>After creating an appointment, go to /direct-appointments to see it with all fields</li>
          </ol>
        </div>

        <DirectAppointmentCreator />
      </div>
    </DashboardLayout>
  )
}
