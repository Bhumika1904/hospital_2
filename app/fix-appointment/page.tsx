import { DashboardLayout } from "@/components/layout"
import { AppointmentFixer } from "@/components/appointment-fixer"

export default function FixAppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Fix Appointments</h1>
        <p className="text-muted-foreground">
          This page helps you fix existing appointments by updating them with correct patient and doctor names.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">How This Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-blue-700">
            <li>This tool fetches all doctors, patients, and appointments from the backend</li>
            <li>It then updates each appointment with the correct patient and doctor names based on their IDs</li>
            <li>After fixing appointments, go to /direct-appointments to see the updated appointments</li>
          </ol>
        </div>

        <AppointmentFixer />
      </div>
    </DashboardLayout>
  )
}
