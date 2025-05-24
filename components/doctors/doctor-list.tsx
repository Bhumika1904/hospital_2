"use client";

import { useEffect } from "react";
import { useData } from "@/context/data-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { doctorsApi } from "@/lib/api/doctors";

export function DoctorList() {
  const { doctors, isLoading, fetchData, error } = useData(); // 🛠️ fixed here
  const { toast } = useToast();

  useEffect(() => {
    console.log("DoctorList component rendered");
    console.log("Doctors from context:", doctors);
    console.log("isLoading:", isLoading);
    console.log("error:", error);

    // Test direct API call
    const testDirectApi = async () => {
      try {
        const directDoctors = await doctorsApi.getDoctors();
        console.log("Direct API call result:", directDoctors);
      } catch (err) {
        console.error("Direct API call failed:", err);
      }
    };

    testDirectApi();
  }, [doctors, isLoading, error]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await doctorsApi.deleteDoctor(id);
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      await fetchData(); // 🛠️ fixed here
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await fetchData(); // 🛠️ fixed here
    toast({
      title: "Refreshed",
      description: "Doctor list has been refreshed",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Doctors</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
            <Link href="/add-doctor">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No doctors found. Add your first doctor to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>
                      <div>{doctor.email}</div>
                      <div className="text-sm text-muted-foreground">{doctor.phone}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/doctors/${doctor._id}/edit`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(doctor._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
