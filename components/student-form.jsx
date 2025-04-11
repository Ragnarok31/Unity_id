"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  classAndDivision: z.string().min(1, { message: "Class & Division is required" }),
  allergies: z.array(z.string()),
  rackNumber: z.string().min(1, { message: "Rack number is required" }),
  busRouteNumber: z.string().min(1, { message: "Bus route is required" }),
  photo: z.string().min(1, { message: "Photo is required" }),
})

const allergiesList = [
  { id: "peanuts", label: "Peanuts" },
  { id: "dairy", label: "Dairy" },
  { id: "gluten", label: "Gluten" },
  { id: "eggs", label: "Eggs" },
  { id: "seafood", label: "Seafood" },
]

const classOptions = [
  "1-A",
  "1-B",
  "2-A",
  "2-B",
  "3-A",
  "3-B",
  "4-A",
  "4-B",
  "5-A",
  "5-B",
  "6-A",
  "6-B",
  "7-A",
  "7-B",
  "8-A",
  "8-B",
  "9-A",
  "9-B",
  "10-A",
  "10-B",
  "11-A",
  "11-B",
  "12-A",
  "12-B",
]

const busRoutes = [
  "Route 1: North Campus",
  "Route 2: South Campus",
  "Route 3: East Campus",
  "Route 4: West Campus",
  "Route 5: Central Area",
  "Route 6: Suburban Area",
]

export function StudentForm({ onSubmit }) {
  const [photoPreview, setPhotoPreview] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollNumber: "",
      classAndDivision: "",
      allergies: [],
      rackNumber: "",
      busRouteNumber: "",
      photo: "",
    },
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          const base64String = reader.result
          setPhotoPreview(base64String)
          form.setValue("photo", base64String)
        } catch (error) {
          console.error("Error processing image:", error)
        }
      }
      reader.onerror = () => {
        console.error("Error reading file")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2023001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classAndDivision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class & Division</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergies"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Allergies</FormLabel>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {allergiesList.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="allergies"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo Upload</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    <Input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
                    {photoPreview && (
                      <div className="mt-2 border rounded-md overflow-hidden w-32 h-32">
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input type="hidden" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rackNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rack Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. R-101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="busRouteNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bus Route</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bus route" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {busRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Generate ID Card
          </Button>
        </form>
      </Form>
    </Card>
  )
}
