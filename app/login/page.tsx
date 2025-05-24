"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { authApi } from "@/lib/api/auth" // Use the new cookie-based auth

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      await authApi.login({
        email: formData.email,
        password: formData.password,
      })

      toast({
        title: "Success",
        description: "Login successful",
      })

      // Use window.location for a hard redirect instead of router.replace
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid email or password. Please try the demo credentials below.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: "admin@example.com",
      password: "password123",
    })
    setError("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            терапта
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                For demo: Use <strong>admin@example.com</strong> and password <strong>password123</strong>
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto text-xs underline ml-1"
                  onClick={fillDemoCredentials}
                >
                  (Click to auto-fill)
                </Button>
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-teal-600 hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} терапта. All rights reserved.
      </footer>
    </div>
  )
}