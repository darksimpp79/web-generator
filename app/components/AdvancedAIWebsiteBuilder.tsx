"use client"

import { useState } from "react"
import AdvancedChatInterface from "./AdvancedChatInterface"
import EnhancedWebsitePreview from "./EnhancedWebsitePreview"
import EnhancedCodeEditor from "./EnhancedCodeEditor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdvancedAIWebsiteBuilder() {
  const [websiteCode, setWebsiteCode] = useState({
    html: '<div class="p-4"><h1 class="text-2xl font-bold mb-2">Welcome to Your New Website</h1><p>Start by asking the AI to add elements or styles to your page.</p></div>',
    css: "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }",
    js: "",
  })

  const handleAIResponse = async (prompt: string) => {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()

      if (data.response) {
        // Parse the AI response and update the website code
        const updatedCode = parseAIResponse(data.response, websiteCode)
        setWebsiteCode(updatedCode)
        return data.response
      } else {
        console.error("Unexpected API response structure:", data)
        return "Sorry, I couldn't process your request. Please try again."
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      return "Sorry, I couldn't process your request. Please try again."
    }
  }

  const parseAIResponse = (response: string, currentCode: typeof websiteCode) => {
    if (response.toLowerCase().includes("background color") && response.toLowerCase().includes("red")) {
      return {
        ...currentCode,
        css: currentCode.css + "\nbody { background-color: red; }",
      }
    }
    // Add more parsing logic for other types of requests here
    return currentCode
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[800px]">
      <AdvancedChatInterface onAIResponse={handleAIResponse} />
      <Tabs defaultValue="preview" className="flex flex-col h-full">
        <TabsList className="mb-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="flex-grow">
          <EnhancedWebsitePreview code={websiteCode} />
        </TabsContent>
        <TabsContent value="code" className="flex-grow">
          <EnhancedCodeEditor code={websiteCode} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

