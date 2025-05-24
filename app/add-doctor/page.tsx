"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function AddDoctor() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: "",
    city: "",
    zipCode: "",
    department: "",
    designation: "",
    joiningDate: "",
    experience: "",
    specialist: "",
    education: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const doctorData = {
      name: `Dr. ${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      specialty: formData.specialist || formData.department,
      department: formData.department,
      experience: `${formData.experience} Years`,
      address: formData.address,
      city: formData.city,
      availability: [
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
        {
          day: "Tuesday",
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      ],
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add doctor: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Doctor added successfully",
      });

      router.push("/doctors");
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add doctor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ✅ ✅ THIS PART WAS MISSING
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add Doctor</h1>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={formData.department} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input id="experience" value={formData.experience} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="specialist">Specialist</Label>
                  <Input id="specialist" value={formData.specialist} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={formData.address} onChange={handleChange} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Doctor"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
