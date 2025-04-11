"use client"

import { useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"

export function IDCardPreview({ student, template }) {
  const cardRef = useRef(null)

  const downloadCard = async () => {
    if (cardRef.current === null) return

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        cacheBust: true, // Add cache busting
        pixelRatio: 2, // Improve quality
      })

      // Create link element in a safer way
      const link = document.createElement("a")
      link.download = `${student.name.replace(/\s+/g, "-")}-id-card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  const getAllergyLabels = (allergyCodes) => {
    const allergyMap = {
      peanuts: "Peanuts",
      dairy: "Dairy",
      gluten: "Gluten",
      eggs: "Eggs",
      seafood: "Seafood",
    }

    return allergyCodes.map((code) => allergyMap[code] || code)
  }

  // Create a copy of student data without the photo for QR code
  const getQRCodeData = () => {
    const { photo, ...studentDataWithoutPhoto } = student
    return JSON.stringify(studentDataWithoutPhoto)
  }

  const templateStyles = {
    blue: {
      bg: "bg-blue-50",
      header: "bg-blue-600",
      accent: "bg-blue-500",
      border: "border-blue-300",
      text: "text-blue-800",
    },
    green: {
      bg: "bg-green-50",
      header: "bg-green-600",
      accent: "bg-green-500",
      border: "border-green-300",
      text: "text-green-800",
    },
  }

  const styles = templateStyles[template]

  return (
    <div className="space-y-4">
      <Card className={`p-0 overflow-hidden ${styles.border}`} ref={cardRef}>
        {template === "blue" ? (
          <div className={`w-full ${styles.bg}`}>
            <div className={`${styles.header} text-white p-4 flex justify-between items-center`}>
              <div>
                <h3 className="text-xl font-bold">Unity School</h3>
                <p className="text-sm">Student ID Card</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Academic Year</p>
                <p className="font-bold">2023-2024</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="w-full aspect-square overflow-hidden rounded-md border-2 border-white shadow-md">
                  <img
                    src={student.photo || "/placeholder.svg"}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <QRCodeSVG value={getQRCodeData()} size={100} className="mx-auto" />
                  <p className="text-xs text-center mt-1">Scan for details</p>
                </div>
              </div>

              <div className="col-span-2 space-y-3">
                <h3 className="text-xl font-bold">{student.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-semibold">Roll Number</p>
                    <p>{student.rollNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Class</p>
                    <p>{student.classAndDivision}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Rack Number</p>
                    <p>{student.rackNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Bus Route</p>
                    <p>{student.busRouteNumber.split(":")[0]}</p>
                  </div>
                </div>

                {student.allergies.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-sm">Allergies</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getAllergyLabels(student.allergies).map((allergy) => (
                        <span key={allergy} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.accent} text-white p-2 text-center text-sm`}>
              <p>Unity School, 123 Education Lane, Knowledge City</p>
              <p>Contact: +1 (555) 123-4567 | www.unityschool.edu</p>
            </div>
          </div>
        ) : (
          <div className={`w-full ${styles.bg}`}>
            <div className={`${styles.header} text-white py-6 px-4 text-center`}>
              <h3 className="text-2xl font-bold">Unity School</h3>
              <p className="text-sm">Excellence in Education</p>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={student.photo || "/placeholder.svg"}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <p className={`${styles.text} font-medium`}>{student.classAndDivision}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="text-center p-2 bg-white rounded shadow">
                  <p className="font-semibold">Roll Number</p>
                  <p>{student.rollNumber}</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow">
                  <p className="font-semibold">Rack Number</p>
                  <p>{student.rackNumber}</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow col-span-2">
                  <p className="font-semibold">Bus Route</p>
                  <p>{student.busRouteNumber}</p>
                </div>
              </div>

              {student.allergies.length > 0 && (
                <div className="mb-4 p-2 bg-white rounded shadow">
                  <p className="font-semibold text-center">Allergies</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {getAllergyLabels(student.allergies).map((allergy) => (
                      <span key={allergy} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <QRCodeSVG value={getQRCodeData()} size={80} />
              </div>
            </div>

            <div className={`${styles.accent} text-white p-2 text-center text-xs`}>
              <p>ID Card valid for Academic Year 2023-2024</p>
              <p>Unity School, 123 Education Lane, Knowledge City</p>
            </div>
          </div>
        )}
      </Card>

      <Button onClick={downloadCard} className="w-full" variant={template === "blue" ? "default" : "outline"}>
        <Download className="mr-2 h-4 w-4" />
        Download as PNG
      </Button>
    </div>
  )
}
