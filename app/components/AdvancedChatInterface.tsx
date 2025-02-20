"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

interface AdvancedChatInterfaceProps {
  onAIResponse: (prompt: string) => Promise<string>
}

interface Message {
  role: "user" | "ai"
  content: string
}

export default function AdvancedChatInterface({ onAIResponse }: AdvancedChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I'm your advanced AI web development assistant. How can I help you create your website today?",
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
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow flex flex-col p-4">
        <ScrollArea className="flex-grow mb-4 pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "ai" ? "text-blue-600" : "text-green-600"}`}>
              <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to add or modify on your website..."
            className="flex-1"
            rows={3}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

