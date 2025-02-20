"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

interface ChatInterfaceProps {
  onAIResponse: (prompt: string) => Promise<string>
  colorMode: "light" | "dark"
}

interface Message {
  role: "user" | "ai"
  content: string
}

export default function ChatInterface({ onAIResponse, colorMode }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I'm your AI website builder assistant. What kind of website would you like me to create for you?",
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    const aiResponse = await onAIResponse(input)
    const aiMessage: Message = { role: "ai", content: aiResponse }
    setMessages((prevMessages) => [...prevMessages, aiMessage])
  }

  return (
    <Card className={`h-full flex flex-col ${colorMode === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <CardContent className="flex-grow flex flex-col p-4">
        <ScrollArea className="flex-grow mb-4 pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "ai" ? "text-blue-500" : "text-green-500"}`}>
              <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
              <p className={`whitespace-pre-wrap ${colorMode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {message.content}
              </p>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want in your website..."
            className={`flex-1 ${colorMode === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            rows={3}
          />
          <Button type="submit" variant={colorMode === "dark" ? "secondary" : "default"}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

