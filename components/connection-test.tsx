"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

export function ConnectionTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDirectApi = async () => {
    setLoading(true)
    setError(null)
    try {
      // Make a direct request to your API without going through your service
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // Handle empty response case
      if (response.data.length === 0) {
        setError("No data found in the response.")
      } else {
        setResult(response.data)
      }
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Direct API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testDirectApi} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? (
            <span className="animate-spin">🔄</span> // Optional: Add a spinner
          ) : "Test Direct API Call"}
        </Button>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">API Response:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
