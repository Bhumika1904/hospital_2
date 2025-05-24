import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SmartBookingCard } from "@/components/dashboard/smart-booking"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              терапта
            </Link>
            <div className="hidden md:flex space-x-4 text-sm">
              <Link href="#" className="text-gray-600 hover:text-teal-600">Hospitals Near Me</Link>
              <Link href="#" className="text-gray-600 hover:text-teal-600">Telemedicine</Link>
              <Link href="/login" className="text-gray-600 hover:text-teal-600">Login</Link>
              <div className="text-gray-600">Emergency: <span className="font-bold">1068</span> | 01-124-4364A</div>
              <div className="text-gray-600">COVID Helpline: <span className="font-bold">+91-124-4834567</span></div>
            </div>
          </div>
          <nav className="mt-4 hidden md:flex space-x-8">
            <Link href="/doctors" className="text-gray-700 hover:text-teal-600 font-medium">Find a Doctor</Link>
            <Link href="#" className="text-gray-700 hover:text-teal-600 font-medium">Treatments</Link>
            <Link href="#" className="text-gray-700 hover:text-teal-600 font-medium">Specialties</Link>
            <Link href="#" className="text-gray-700 hover:text-teal-600 font-medium">International Patients</Link>
            <Link href="#" className="text-gray-700 hover:text-teal-600 font-medium">Facilities & Services</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-teal-700/50 z-10" />
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="Medical professionals"
            width={1600}
            height={600}
            className="w-full h-[500px] object-cover"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">A Destination for Advanced Care</h1>
            <p className="text-xl md:text-2xl mb-8 text-center">Get a Second Opinion From The World's Best Doctors</p>
            <div className="w-full max-w-2xl bg-white rounded-lg p-2 flex items-center">
              <Search className="text-gray-400 ml-2 mr-2" />
              <Input
                type="text"
                placeholder="Type in a Doctor's name, specialty treatment type or ailment"
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="ml-2 bg-teal-600 hover:bg-teal-700">Search</Button>
            </div>
            <Button className="mt-8 bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg">
              Book an Appointment
            </Button>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="p-12 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <p className="text-lg text-teal-600 font-semibold">Your Dashboard</p>
            <h2 className="text-3xl font-bold">Manage Your Appointments & Preferences</h2>
          </div>

          <div className="mb-12">
            <SmartBookingCard />
          </div>

          <div className="grid text-center lg:grid-cols-4 gap-6 text-gray-700 dark:text-white">
            <a
              href="https://nextjs.org/docs"
              className="group rounded-lg border px-5 py-4 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-2xl font-semibold mb-2">Docs →</h2>
              <p className="text-sm opacity-70">Find in-depth information about Next.js features and API.</p>
            </a>
            <a
              href="https://nextjs.org/learn"
              className="group rounded-lg border px-5 py-4 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-2xl font-semibold mb-2">Learn →</h2>
              <p className="text-sm opacity-70">Interactive course with quizzes to learn Next.js.</p>
            </a>
            <a
              href="https://vercel.com/templates?framework=next.js"
              className="group rounded-lg border px-5 py-4 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-2xl font-semibold mb-2">Templates →</h2>
              <p className="text-sm opacity-70">Explore starter templates for Next.js.</p>
            </a>
            <a
              href="https://vercel.com/new"
              className="group rounded-lg border px-5 py-4 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-2xl font-semibold mb-2">Deploy →</h2>
              <p className="text-sm opacity-70">Deploy your site instantly with Vercel.</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
