"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Search, Plus, MoreHorizontal } from "lucide-react"

interface Message {
  id: string
  sender: string
  senderAvatar: string
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  course?: string
}

interface Conversation {
  id: string
  participant: string
  participantAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  course?: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: "Dr. Sarah Wilson",
    participantAvatar: "/instructor-teaching.png",
    lastMessage: "Great work on your latest assignment! I have some feedback...",
    timestamp: "2h ago",
    unreadCount: 2,
    course: "Introduction to React",
  },
  {
    id: "2",
    participant: "Mike Johnson",
    participantAvatar: "/instructor-teaching.png",
    lastMessage: "The design principles you applied are excellent. Consider...",
    timestamp: "1d ago",
    unreadCount: 0,
    course: "UI/UX Design",
  },
  {
    id: "3",
    participant: "Alice Cooper",
    participantAvatar: "/diverse-students-studying.png",
    lastMessage: "Hey! Want to form a study group for the upcoming exam?",
    timestamp: "2d ago",
    unreadCount: 1,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Sarah Wilson",
    senderAvatar: "/instructor-teaching.png",
    subject: "Assignment Feedback - React Components",
    preview: "I've reviewed your React component assignment and I'm impressed with your implementation...",
    timestamp: "2 hours ago",
    isRead: false,
    course: "Introduction to React",
  },
  {
    id: "2",
    sender: "Mike Johnson",
    senderAvatar: "/instructor-teaching.png",
    subject: "Design Portfolio Review",
    preview: "Your portfolio shows great progress in understanding design principles. I particularly liked...",
    timestamp: "1 day ago",
    isRead: true,
    course: "UI/UX Design",
  },
  {
    id: "3",
    sender: "Alice Cooper",
    senderAvatar: "/diverse-students-studying.png",
    subject: "Study Group Formation",
    preview: "Hi! I'm organizing a study group for the upcoming JavaScript exam. Would you like to join?",
    timestamp: "2 days ago",
    isRead: false,
  },
]

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const unreadCount = mockMessages.filter((message) => !message.isRead).length

  const filteredConversations = mockConversations.filter(
    (conversation) =>
      conversation.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-white">Communicate with instructors and classmates</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMessages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Badge variant="destructive">{unreadCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockConversations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={conversation.participantAvatar || "/placeholder.svg"}
                        alt={conversation.participant}
                      />
                      <AvatarFallback>{conversation.participant.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.participant}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      {conversation.course && (
                        <p className="text-xs text-muted-foreground mb-1">{conversation.course}</p>
                      )}
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {conversation.unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          filteredConversations.find((c) => c.id === selectedConversation)?.participantAvatar ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Participant"
                      />
                      <AvatarFallback>
                        {filteredConversations.find((c) => c.id === selectedConversation)?.participant.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {filteredConversations.find((c) => c.id === selectedConversation)?.participant}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredConversations.find((c) => c.id === selectedConversation)?.course}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-4">
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {/* Sample messages */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted">
                      <p className="text-sm">
                        Great work on your latest assignment! I have some feedback that I think will help you improve
                        even further.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                      <p className="text-sm">
                        Thank you! I'd love to hear your feedback. When would be a good time to discuss it?
                      </p>
                      <p className="text-xs text-primary-foreground/70 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging.</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
