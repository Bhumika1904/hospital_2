"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, UserRound, CalendarPlus, UserPlus, UserCog, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile menu button */}
      <button className="md:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md" onClick={toggleSidebar}>
        {sidebarOpen ? <X className="h-6 w-6 text-teal-600" /> : <Menu className="h-6 w-6 text-teal-600" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white border-r shadow-sm transition-all duration-300 ease-in-out",
          "fixed md:static inset-y-0 left-0 z-40 md:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            терапта
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center p-2 rounded-md ${
              isActive("/dashboard") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/doctors"
            className={`flex items-center p-2 rounded-md ${
              isActive("/doctors") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <UserRound className="mr-2 h-5 w-5" />
            Doctor List
          </Link>
          <Link
            href="/patients"
            className={`flex items-center p-2 rounded-md ${
              isActive("/patients") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <Users className="mr-2 h-5 w-5" />
            Patient List
          </Link>
          <Link
            href="/add-doctor"
            className={`flex items-center p-2 rounded-md ${
              isActive("/add-doctor") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <UserCog className="mr-2 h-5 w-5" />
            Add Doctor
          </Link>
          <Link
            href="/add-appointment"
            className={`flex items-center p-2 rounded-md ${
              isActive("/add-appointment") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            Add Appointment
          </Link>
          <Link
            href="/add-patient"
            className={`flex items-center p-2 rounded-md ${
              isActive("/add-patient") ? "bg-teal-100 text-teal-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add Patient
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        {children}
      </main>
    </div>
  )
}

