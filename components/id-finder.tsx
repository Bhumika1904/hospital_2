"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/context/data-context";

export function IdFinder() {
  const { doctors, patients, fetchData } = useData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, [fetchData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Find Patient and Doctor IDs</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={refreshData} disabled={loading} className="mb-4">
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>

        <Tabs defaultValue="patients">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
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
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {patient.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(patient.id)}>
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
          </TabsContent>

          <TabsContent value="doctors">
            {doctors.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialty
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
                    {doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {doctor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.specialty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {doctor._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(doctor._id)}>
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
                {loading ? "Loading doctors..." : "No doctors found"}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
