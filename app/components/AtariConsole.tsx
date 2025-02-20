"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface AtariConsoleProps {
  colorMode: "light" | "dark"
}

export default function AtariConsole({ colorMode }: AtariConsoleProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>(["Welcome to Atari Console!", 'Type "help" for commands.'])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOutput((prev) => [...prev, `> ${input}`])
    processCommand(input)
    setInput("")
  }

  const processCommand = (cmd: string) => {
    switch (cmd.toLowerCase()) {
      case "help":
        setOutput((prev) => [...prev, "Available commands: help, clear, date, echo <message>"])
        break
      case "clear":
        setOutput([])
        break
      case "date":
        setOutput((prev) => [...prev, new Date().toLocaleString()])
        break
      default:
        if (cmd.toLowerCase().startsWith("echo ")) {
          setOutput((prev) => [...prev, cmd.slice(5)])
        } else {
          setOutput((prev) => [...prev, 'Unknown command. Type "help" for available commands.'])
        }
    }
  }

  useEffect(() => {
    const consoleElement = document.getElementById("atari-console")
    if (consoleElement) {
      consoleElement.scrollTop = consoleElement.scrollHeight
    }
  }, [output])

  return (
    <div
      className={`font-mono ${colorMode === "dark" ? "bg-black text-green-400" : "bg-green-200 text-black"} p-4 rounded-lg shadow-lg`}
    >
      <div id="atari-console" className="h-64 overflow-y-auto mb-4 p-2 border-2 border-gray-600">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-grow mr-2 p-2 ${colorMode === "dark" ? "bg-gray-800 text-green-400" : "bg-white text-black"} border-2 border-gray-600`}
          placeholder="Enter command..."
        />
        <Button type="submit" variant={colorMode === "dark" ? "outline" : "default"}>
          Execute
        </Button>
      </form>
    </div>
  )
}

