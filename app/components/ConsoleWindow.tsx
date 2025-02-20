"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface ConsoleWindowProps {
  title: string
  content: string
  onCommand?: (command: string) => void
  onCodeChange?: (newCode: string) => void
  className?: string
  zoom: number
}

export default function ConsoleWindow({
  title,
  content,
  onCommand,
  onCodeChange,
  className,
  zoom,
}: ConsoleWindowProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [content])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && onCommand) {
      e.preventDefault()
      onCommand(input)
      setInput("")
    }
  }

  return (
    <div className={`p-4 font-mono text-sm overflow-y-auto ${className}`} style={{ fontSize: `${14 * zoom}px` }}>
      {onCodeChange ? (
        <textarea
          value={content}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full bg-transparent border-none outline-none text-[#00ff00] resize-none"
        />
      ) : (
        <>
          <div className="whitespace-pre-wrap">{content}</div>
          {onCommand && (
            <div className="mt-2 flex items-center">
              <span className="mr-2">{">"}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-[#00ff00]"
                placeholder="Wpisz komendę..."
              />
            </div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

