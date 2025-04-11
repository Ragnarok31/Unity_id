"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { ClientWrapper } from "./client-wrapper"

export function SavedCards({ cards, onSelect, onDelete }) {
  // Create a copy of student data without the photo for QR code
  const getQRCodeData = (student) => {
    const { photo, ...studentDataWithoutPhoto } = student
    return JSON.stringify(studentDataWithoutPhoto)
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No saved cards yet. Create your first ID card!</p>
      </div>
    )
  }

  return (
    <ClientWrapper
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-500">Loading saved cards...</p>
        </div>
      }
    >
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Saved ID Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-gray-100 p-4 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                  <img src={card.photo || "/placeholder.svg"} alt={card.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold">{card.name}</h3>
                  <p className="text-sm text-gray-600">{card.classAndDivision}</p>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="font-semibold">Roll Number</p>
                    <p>{card.rollNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Bus Route</p>
                    <p>{card.busRouteNumber.split(":")[0]}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onSelect(card)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <QRCodeSVG value={getQRCodeData(card)} size={40} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ClientWrapper>
  )
}
