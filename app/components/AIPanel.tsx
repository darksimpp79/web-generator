"use client"

import { useState, type React } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIPanelProps {
  onAIResponse: (response: string) => void
  onCodeGenerated: (html: string, css: string) => void
}

export default function AIPanel({ onAIResponse, onCodeGenerated }: AIPanelProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<{ role: "user" | "ai"; content: string }[]>([
    {
      role: "ai",
      content: "Hello! I'm your AI assistant powered by Gemini. How can I help you with your website?",
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setConversation((prev) => [...prev, { role: "user", content: input }])

    console.log("Sending request to AI...")

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received AI response:", data)

      let aiResponse = "Sorry, I couldn't generate the content."
      if (data.success) {
        aiResponse = "I've generated the HTML and CSS for your website. You can see the preview now."
        onCodeGenerated(data.html, data.css)
      } else if (data.error) {
        aiResponse = `Error: ${data.error}\nDetails: ${data.details || "No additional details available."}\n\nTry rephrasing your request. For example:\n- "Create a simple landing page with a header and two paragraphs"\n- "Make a contact form with name and email fields"\n- "Design a product card with an image and price"`
        console.error("AI Response Error:", {
          error: data.error,
          details: data.details,
          rawContent: data.rawContent,
        })
      }
      setConversation((prev) => [...prev, { role: "ai", content: aiResponse }])
      onAIResponse(aiResponse)
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: `Sorry, an error occurred while processing the query: ${errorMessage}` },
      ])
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <ScrollArea className="flex-grow mb-4 pr-4">
        {conversation.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "ai" ? "text-[#00ff00]" : "text-[#00ffff]"}`}>
            <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query for AI..."
          className="bg-black text-[#00ff00] border-[#00ff00]"
          rows={3}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#003300] text-[#00ff00] border border-[#00ff00] hover:bg-[#004400]"
        >
          {isLoading ? "Processing..." : "Send"}
        </Button>
      </form>
    </div>
  )
}

