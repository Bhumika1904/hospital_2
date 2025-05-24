"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPassword() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // For demo purposes, we'll just simulate a successful password reset request
    // In a real app, you would send this to your backend
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email",
      })
    }, 1500)
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
            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md text-green-800 text-center">
                  <p>We've sent password reset instructions to:</p>
                  <p className="font-medium">{email}</p>
                </div>
                <div className="text-center text-sm">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-teal-600 hover:underline mt-2">
                    Try again
                  </button>
                </div>
                <div className="text-center">
                  <Link href="/login">
                    <Button variant="outline">Back to Login</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="text-teal-600 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} терапта. All rights reserved.
      </footer>
    </div>
  )
}

