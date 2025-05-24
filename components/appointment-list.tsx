// AppointmentsList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  patientId: string;
  doctorId: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  updateStatus: (appointmentId: string, newStatus: string) => void;
  isLoading: boolean;
  patients: any[];
  doctors: any[];
}

const AppointmentsList = ({ appointments, updateStatus, isLoading, patients, doctors }: AppointmentsListProps) => {
  return (
    <>
      {appointments.map((appointment) => (
        <Card key={appointment._id} className="mb-4">
          <CardContent>
            <h3>{appointment.patientName} - {appointment.doctorName}</h3>
            <p>{appointment.date}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{appointment.status}</Badge>
              <div className="flex gap-2">
                <Button
                  onClick={() => updateStatus(appointment._id, "Visited")}
                  disabled={isLoading || appointment.status === "Visited"}
                >
                  <CheckCircle className="h-4 w-4" /> Mark as Visited
                </Button>
                <Button
                  onClick={() => updateStatus(appointment._id, "Cancelled")}
                  disabled={isLoading || appointment.status === "Cancelled"}
                >
                  <XCircle className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default AppointmentsList;
