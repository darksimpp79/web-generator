"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  html: string
  css: string
  onHtmlChange: (newHtml: string) => void
  onCssChange: (newCss: string) => void
}

export default function CodeEditor({ html, css, onHtmlChange, onCssChange }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css">("html")

  const handleTabChange = (tab: "html" | "css") => {
    setActiveTab(tab)
  }

  return (
    <div className="flex flex-col h-full bg-black text-[#00ff00] p-2">
      <div className="flex mb-2">
        <Button
          onClick={() => handleTabChange("html")}
          variant={activeTab === "html" ? "default" : "outline"}
          className={`mr-2 ${
            activeTab === "html" ? "bg-[#003300] text-[#00ff00]" : "bg-black text-[#00ff00] border-[#00ff00]"
          }`}
        >
          HTML
        </Button>
        <Button
          onClick={() => handleTabChange("css")}
          variant={activeTab === "css" ? "default" : "outline"}
          className={`${
            activeTab === "css" ? "bg-[#003300] text-[#00ff00]" : "bg-black text-[#00ff00] border-[#00ff00]"
          }`}
        >
          CSS
        </Button>
      </div>
      <div className="flex-grow">
        {activeTab === "html" ? (
          <Textarea
            value={html}
            onChange={(e) => onHtmlChange(e.target.value)}
            className="w-full h-full bg-black text-[#00ff00] border-[#00ff00] resize-none p-2 focus:outline-none"
            placeholder="Enter your HTML here..."
            spellCheck="false"
          />
        ) : (
          <Textarea
            value={css}
            onChange={(e) => onCssChange(e.target.value)}
            className="w-full h-full bg-black text-[#00ff00] border-[#00ff00] resize-none p-2 focus:outline-none"
            placeholder="Enter your CSS here..."
            spellCheck="false"
          />
        )}
      </div>
    </div>
  )
}

