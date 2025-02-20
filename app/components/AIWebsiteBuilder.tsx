"use client"

import { useState } from "react"
import ChatInterface from "./ChatInterface"
import WebsitePreview from "./WebsitePreview"
import ColorModeToggle from "./ColorModeToggle"
import AtariConsole from "./AtariConsole"

export default function AIWebsiteBuilder() {
  const [websiteCode, setWebsiteCode] = useState({
    html: '<div class="p-4"><h1 class="text-2xl font-bold mb-2">Welcome to Your New Website</h1><p>Start by describing what you want in your website.</p></div>',
    css: "body { font-family: Arial, sans-serif; line-height: 1.6; }",
    js: "",
  })
  const [colorMode, setColorMode] = useState<"light" | "dark">("light")

  const handleAIResponse = async (prompt: string) => {
    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, colorMode }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      setWebsiteCode(data)
      return "I've updated your website based on your request. Check the preview to see the changes!"
    } catch (error) {
      console.error("Error generating website:", error)
      return "Sorry, I couldn't process your request. Please try again."
    }
  }

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  return (
    <div className={`min-h-screen ${colorMode === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
          <ColorModeToggle colorMode={colorMode} toggleColorMode={toggleColorMode} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChatInterface onAIResponse={handleAIResponse} colorMode={colorMode} />
          <WebsitePreview code={websiteCode} colorMode={colorMode} />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Atari-Style Console</h2>
          <AtariConsole colorMode={colorMode} />
        </div>
      </div>
    </div>
  )
}

