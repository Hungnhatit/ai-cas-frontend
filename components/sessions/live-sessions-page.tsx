"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  Calendar,
  Users,
  Clock,
  Plus,
  Play,
  Square,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  Settings,
} from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useAuth } from "@/providers/auth-provider"

interface LiveSession {
  id: string
  title: string
  course: string
  date: string
  time: string
  duration: string
  attendees: number
  maxAttendees: number
  status: "scheduled" | "live" | "ended"
  description?: string
}

const mockSessions: LiveSession[] = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    course: "Introduction to React",
    date: "2024-12-28",
    time: "10:00",
    duration: "1h 30m",
    attendees: 25,
    maxAttendees: 50,
    status: "scheduled",
    description: "Comprehensive overview of React hooks with live coding examples",
  },
  {
    id: "2",
    title: "JavaScript ES6+ Features",
    course: "Advanced JavaScript",
    date: "2024-12-27",
    time: "14:00",
    duration: "2h",
    attendees: 18,
    maxAttendees: 30,
    status: "live",
    description: "Exploring modern JavaScript features and best practices",
  },
  {
    id: "3",
    title: "Design System Workshop",
    course: "UI/UX Design",
    date: "2024-12-26",
    time: "16:00",
    duration: "1h",
    attendees: 32,
    maxAttendees: 40,
    status: "ended",
    description: "Building scalable design systems for web applications",
  },
]

export function LiveSessionsPage() {
  const { courses } = useCourses()
  const { user } = useAuth()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)

  const myCourses = courses.filter((course) => course.instructor === user?.name)
  const liveSessions = mockSessions.filter((session) => session.status === "live")
  const upcomingSessions = mockSessions.filter((session) => session.status === "scheduled")
  const pastSessions = mockSessions.filter((session) => session.status === "ended")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "destructive"
      case "scheduled":
        return "default"
      case "ended":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleStartSession = (sessionId: string) => {
    setIsLive(true)
    // In a real app, this would start the actual live session
  }

  const handleEndSession = () => {
    setIsLive(false)
    // In a real app, this would end the live session
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground">Conduct live classes and interact with students</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Live Session</DialogTitle>
              <DialogDescription>Create a new live session for your students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-title">Session Title</Label>
                <Input id="session-title" placeholder="Enter session title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-course">Course</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-date">Date</Label>
                  <Input id="session-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-time">Time</Label>
                  <Input id="session-time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-duration">Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="1h30m">1.5 hours</SelectItem>
                    <SelectItem value="2h">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-description">Description (optional)</Label>
                <Textarea id="session-description" placeholder="Describe what you'll cover in this session" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCreateDialogOpen(false)}>Schedule Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Now</CardTitle>
            <Video className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveSessions.length}</div>
            <p className="text-xs text-muted-foreground">Active sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSessions.reduce((sum, session) => sum + session.attendees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h 30m</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Session Controls */}
      {isLive && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Session Active
            </CardTitle>
            <CardDescription>You are currently broadcasting to students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={micEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setMicEnabled(!micEnabled)}
                >
                  {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={cameraEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                >
                  {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">25 viewers</Badge>
                <Button variant="destructive" onClick={handleEndSession}>
                  <Square className="mr-2 h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="live">Live ({liveSessions.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">Schedule your first live session to get started.</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        {session.title}
                      </CardTitle>
                      <CardDescription>{session.course}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(session.status)} className="capitalize">
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {session.time} • {session.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {session.attendees}/{session.maxAttendees}
                      </span>
                    </div>
                    <Button onClick={() => handleStartSession(session.id)}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {liveSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No live sessions</h3>
                <p className="text-muted-foreground">Start a scheduled session or create a new one.</p>
              </CardContent>
            </Card>
          ) : (
            liveSessions.map((session) => (
              <Card key={session.id} className="border-destructive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        {session.title}
                      </CardTitle>
                      <CardDescription>{session.course}</CardDescription>
                    </div>
                    <Badge variant="destructive">LIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {session.attendees} viewers
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        Started at {session.time}
                      </span>
                    </div>
                    <Button variant="destructive">
                      <Square className="mr-2 h-4 w-4" />
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      {session.title}
                    </CardTitle>
                    <CardDescription>{session.course}</CardDescription>
                  </div>
                  <Badge variant="secondary">Ended</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{session.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {session.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {session.attendees} attended
                    </span>
                  </div>
                  <Button variant="outline">View Recording</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
