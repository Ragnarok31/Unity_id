"use client"

import { useState, useEffect } from "react"
import { StudentForm } from "@/components/student-form"
import { IDCardPreview } from "@/components/id-card-preview"
import { SavedCards } from "@/components/saved-cards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [student, setStudent] = useState(null)
  const [template, setTemplate] = useState("blue")
  const [savedCards, setSavedCards] = useState([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true)

    // Load saved cards from localStorage only on the client
    const saved = localStorage.getItem("savedCards")
    if (saved) {
      try {
        setSavedCards(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing saved cards:", e)
      }
    }
  }, [])

  const handleFormSubmit = (data) => {
    setStudent(data)

    // Save to localStorage only on the client
    if (isClient) {
      const updatedCards = [...savedCards, data]
      setSavedCards(updatedCards)
      localStorage.setItem("savedCards", JSON.stringify(updatedCards))
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Unity Student ID Card Generator</h1>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">Create New Card</TabsTrigger>
          <TabsTrigger value="saved">Saved Cards ({isClient ? savedCards.length : 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
              <StudentForm onSubmit={handleFormSubmit} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">ID Card Preview</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Template:</span>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="blue">Blue Template</option>
                    <option value="green">Green Template</option>
                  </select>
                </div>
              </div>

              {student ? (
                <IDCardPreview student={student} template={template} />
              ) : (
                <div className="border border-dashed rounded-lg p-8 flex items-center justify-center h-[400px]">
                  <p className="text-gray-500">Fill and submit the form to generate ID card</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          {isClient ? (
            <SavedCards
              cards={savedCards}
              onSelect={(student) => {
                setStudent(student)
                document
                  .querySelector('[data-value="create"]')
                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
              }}
              onDelete={(index) => {
                const updated = savedCards.filter((_, i) => i !== index)
                setSavedCards(updated)
                localStorage.setItem("savedCards", JSON.stringify(updated))
              }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading saved cards...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
