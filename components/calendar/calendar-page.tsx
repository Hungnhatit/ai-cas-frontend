"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Video, BookOpen, Users } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  type: "assignment" | "lecture" | "exam" | "meeting"
  course: string
  date: string
  time: string
  duration: string
  description?: string
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "React Hooks Assignment Due",
    type: "assignment",
    course: "Introduction to React",
    date: "2024-12-30",
    time: "23:59",
    duration: "Due",
    description: "Complete the React hooks exercise",
  },
  {
    id: "2",
    title: "JavaScript Fundamentals Lecture",
    type: "lecture",
    course: "Advanced JavaScript",
    date: "2024-12-28",
    time: "10:00",
    duration: "1h 30m",
    description: "Covering closures and prototypes",
  },
  {
    id: "3",
    title: "Design Principles Exam",
    type: "exam",
    course: "UI/UX Design",
    date: "2025-01-05",
    time: "14:00",
    duration: "2h",
    description: "Midterm examination",
  },
  {
    id: "4",
    title: "Office Hours",
    type: "meeting",
    course: "Introduction to React",
    date: "2024-12-27",
    time: "15:00",
    duration: "1h",
    description: "Q&A session with instructor",
  },
]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <BookOpen className="h-4 w-4" />
      case "lecture":
        return <Video className="h-4 w-4" />
      case "exam":
        return <Clock className="h-4 w-4" />
      case "meeting":
        return <Users className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "destructive"
      case "lecture":
        return "default"
      case "exam":
        return "secondary"
      case "meeting":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isToday = (date: string) => {
    const today = new Date()
    const eventDate = new Date(date)
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    )
  }

  const isUpcoming = (date: string) => {
    const today = new Date()
    const eventDate = new Date(date)
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }

  const upcomingEvents = mockEvents
    .filter((event) => isUpcoming(event.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const todayEvents = mockEvents.filter((event) => isToday(event.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Stay organized with your schedule</p>
        </div>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Today's Events
            </CardTitle>
            <CardDescription>Events scheduled for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                <div className="flex items-center space-x-3">
                  {getEventTypeIcon(event.type)}
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.course}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={getEventTypeColor(event.type)} className="capitalize">
                    {event.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {event.time} • {event.duration}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground">Your calendar is clear for the next week.</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getEventTypeIcon(event.type)}
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.course}</p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={getEventTypeColor(event.type)} className="capitalize">
                          {event.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.time} • {event.duration}
                        </p>
                      </div>
                    </div>
                    {event.id !== upcomingEvents[upcomingEvents.length - 1].id && <hr className="border-border" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assignments Due</span>
                <Badge variant="destructive">
                  {mockEvents.filter((e) => e.type === "assignment" && isUpcoming(e.date)).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lectures</span>
                <Badge variant="default">
                  {mockEvents.filter((e) => e.type === "lecture" && isUpcoming(e.date)).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Exams</span>
                <Badge variant="secondary">
                  {mockEvents.filter((e) => e.type === "exam" && isUpcoming(e.date)).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meetings</span>
                <Badge variant="outline">
                  {mockEvents.filter((e) => e.type === "meeting" && isUpcoming(e.date)).length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="mr-2 h-4 w-4" />
                View Assignments
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Video className="mr-2 h-4 w-4" />
                Join Live Session
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
