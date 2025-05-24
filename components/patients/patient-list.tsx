"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useData } from "@/context/data-context"
import { Loader2, Plus, Trash2, Edit, FileText } from "lucide-react"

export function PatientList() {
  const { patients, isLoading, error, deletePatient, refreshPatients } = useData()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    console.log("PatientList - Current patients:", patients)
    refreshPatients()
  }, [refreshPatients])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return

    try {
      setIsDeleting(id)
      const result = await deletePatient(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Patient deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete patient",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Patients</h2>
          <Link href="/add-patient">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No patients found. Add your first patient to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender || "Not specified"}</TableCell>
                    <TableCell>
                      <div>{patient.email}</div>
                      <div className="text-sm text-muted-foreground">{patient.phone}</div>
                    </TableCell>
                    <TableCell>{patient.bloodGroup || "Not specified"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="outline" size="icon" title="View Patient">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/edit`}>
                          <Button variant="outline" size="icon" title="Edit Patient">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(patient.id)}
                          disabled={isDeleting === patient.id}
                          title="Delete Patient"
                        >
                          {isDeleting === patient.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
  )
}
