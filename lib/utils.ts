import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication utilities
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("adminToken")
}

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
  }
}

// Date formatting utilities
export const formatEventDateTime = (date: string, time: string): string => {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// CSV export utility
export const exportToCSV = (data: any[], filename: string): void => {
  const csvContent = data.map((row) => row.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}
