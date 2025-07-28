// Mock database utilities for demonstration
// In a real application, this would connect to your actual database

export interface Event {
  id: number
  name: string
  date: string
  time: string
  location: string
  description?: string
  attendeeCount: number
  createdAt: string
}

export interface Attendee {
  id: number
  eventId: number
  name: string
  nip: string
  email: string
  timestamp: string
}

// Mock data
const mockEvents: Event[] = [
  {
    id: 1,
    name: "Workshop Digital Marketing 2024",
    date: "2024-02-15",
    time: "09:00",
    location: "Ruang Seminar A, Lantai 3",
    description: "Workshop tentang strategi digital marketing terkini",
    attendeeCount: 45,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Training Leadership & Management",
    date: "2024-02-20",
    time: "13:30",
    location: "Auditorium Utama",
    description: "Pelatihan kepemimpinan untuk manager",
    attendeeCount: 32,
    createdAt: "2024-02-02T14:00:00Z",
  },
]

const mockAttendees: Attendee[] = [
  {
    id: 1,
    eventId: 1,
    name: "Ahmad Rizki Pratama",
    nip: "EMP001",
    email: "ahmad.rizki@company.com",
    timestamp: "2024-02-15T08:45:00Z",
  },
  {
    id: 2,
    eventId: 1,
    name: "Sari Dewi Lestari",
    nip: "EMP002",
    email: "sari.dewi@company.com",
    timestamp: "2024-02-15T08:52:00Z",
  },
]

// Database functions
export const getEvents = async (): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockEvents
}

export const getEventById = async (id: number): Promise<Event | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockEvents.find((event) => event.id === id) || null
}

export const createEvent = async (eventData: Omit<Event, "id" | "attendeeCount" | "createdAt">): Promise<Event> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newEvent: Event = {
    ...eventData,
    id: Math.max(...mockEvents.map((e) => e.id)) + 1,
    attendeeCount: 0,
    createdAt: new Date().toISOString(),
  }
  mockEvents.push(newEvent)
  return newEvent
}

export const getAttendeesByEventId = async (eventId: number): Promise<Attendee[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockAttendees.filter((attendee) => attendee.eventId === eventId)
}

export const createAttendee = async (attendeeData: Omit<Attendee, "id" | "timestamp">): Promise<Attendee> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Check for duplicate
  const existing = mockAttendees.find((a) => a.eventId === attendeeData.eventId && a.nip === attendeeData.nip)

  if (existing) {
    throw new Error("Attendee already exists")
  }

  const newAttendee: Attendee = {
    ...attendeeData,
    id: Math.max(...mockAttendees.map((a) => a.id), 0) + 1,
    timestamp: new Date().toISOString(),
  }

  mockAttendees.push(newAttendee)

  // Update event attendee count
  const event = mockEvents.find((e) => e.id === attendeeData.eventId)
  if (event) {
    event.attendeeCount += 1
  }

  return newAttendee
}

export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Mock authentication - in real app, validate against database
  return email === "admin@company.com" && password === "admin123"
}
