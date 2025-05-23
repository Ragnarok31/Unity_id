"use client"

import { useState, useEffect } from "react"

export function ClientWrapper({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback
  }

  return <>{children}</>
}
