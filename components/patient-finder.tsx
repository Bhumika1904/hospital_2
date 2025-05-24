"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PatientFinder() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: {
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Patients data:", data)

      // Handle different response formats
      const patientsList = Array.isArray(data) ? data : data.patients || []
      setPatients(patientsList)
    } catch (err: any) {
      console.error("Error fetching patients:", err)
      setError(err.message || "Failed to fetch patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Patient Finder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={fetchPatients} disabled={loading}>
            {loading ? "Loading..." : "Refresh Patients"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {patients.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient._id || patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {patient._id || patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(patient._id || patient.id)}>
                          Copy ID
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {loading ? "Loading patients..." : "No patients found"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
