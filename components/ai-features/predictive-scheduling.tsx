"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, CalendarIcon, TrendingUp, Users, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import {
  PredictiveSchedulingAPI,
  type DemandForecast,
  type DoctorScheduleRecommendation,
} from "@/lib/api/predictive-scheduling-api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PredictiveScheduling() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [demandForecast, setDemandForecast] = useState<DemandForecast[]>([])
  const [doctorRecommendations, setDoctorRecommendations] = useState<DoctorScheduleRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch demand forecast when department or date changes
  useEffect(() => {
    fetchData()
  }, [selectedDepartment, selectedDate])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Format date for API
      const formattedDate = format(selectedDate, "yyyy-MM-dd")

      // Fetch demand forecast
      const forecastData = await PredictiveSchedulingAPI.fetchDemandForecast(selectedDepartment, formattedDate)
      setDemandForecast(forecastData.forecast)

      // Fetch doctor recommendations
      const recommendationsData = await PredictiveSchedulingAPI.fetchDoctorRecommendations(
        selectedDepartment,
        formattedDate,
      )
      setDoctorRecommendations(recommendationsData.recommendations)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-teal-600" />
            AI-Powered Demand Forecasting & Scheduling
          </CardTitle>
          <CardDescription>Optimize doctor schedules based on predicted patient demand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Week Starting</label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border-0"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="forecast">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
              <TabsTrigger value="recommendations">Doctor Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="pt-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              ) : demandForecast.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Weekly Demand Forecast</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Predicted appointment demand based on historical data and current trends
                    </p>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={demandForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis label={{ value: "Demand (%)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="morning" name="Morning" fill="#0ea5e9" />
                        <Bar dataKey="afternoon" name="Afternoon" fill="#8884d8" />
                        <Bar dataKey="evening" name="Evening" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">AI Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>
                        • Highest demand expected on {demandForecast[0]?.day} and {demandForecast[5]?.day} mornings
                      </li>
                      <li>• {demandForecast[1]?.day} afternoons show 15% higher demand than last month</li>
                      <li>• Evening slots on {demandForecast[3]?.day} are trending upward</li>
                      <li>• Weekend demand has increased by 22% compared to last quarter</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No forecast data available for the selected criteria.
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="pt-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              ) : doctorRecommendations.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Optimized Doctor Schedules</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-recommended schedules based on predicted demand and doctor specialties
                  </p>

                  {doctorRecommendations.map((rec) => (
                    <Card key={rec.doctorId} className="border-l-4 border-l-teal-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          <Users className="h-4 w-4 text-teal-600 mr-2" />
                          {rec.doctorName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-2">Recommended Schedule:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {rec.recommendedSlots.map((slot, idx) => (
                              <div key={idx} className="flex items-start">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                                <div>
                                  <div className="font-medium text-sm">{slot.day}</div>
                                  <div className="text-xs text-muted-foreground">{slot.slots.join(", ")}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          <span className="font-medium">AI Reasoning:</span> {rec.reasoning}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button className="w-full">Apply Recommended Schedules</Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recommendations available for the selected criteria.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
