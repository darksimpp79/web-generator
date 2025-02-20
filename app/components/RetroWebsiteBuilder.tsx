"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import DraggableWindow from "./DraggableWindow"
import SystemBar from "./SystemBar"
import WebsitePreview from "./WebsitePreview"
import AIPanel from "./AIPanel"
import CodeEditor from "./CodeEditor"
import type { WebsiteCode } from "@/types/website"
import { ZoomIn, ZoomOut, Minimize2 } from "lucide-react"
import { downloadFile } from "@/utils/fileDownload"

type WindowType = "generator" | "html" | "css" | "preview" | "ai" | "code-editor"

interface Window {
  type: WindowType
  title: string
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zoom: number
  isMinimized: boolean
  zIndex: number
}

const TASKBAR_HEIGHT = 40 // wysokość taskbara w pikselach

export default function RetroWebsiteBuilder() {
  const [time, setTime] = useState(new Date())
  const [websiteCode, setWebsiteCode] = useState<WebsiteCode>({
    html: '<div class="container"><h1>Welcome to your new website</h1><p>Start by typing a command in the console or edit the code directly.</p></div>',
    css: "body { font-family: Arial, sans-serif; } .container { padding: 20px; }",
    js: "",
  })
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "System ready to generate website...",
    'Type "help" to see available commands.',
    "You can also click on the HTML and CSS windows to edit the code directly.",
  ])
  const [openWindows, setOpenWindows] = useState<Window[]>([])
  const [nextZIndex, setNextZIndex] = useState(1)

  const getWindowTitle = useCallback((type: WindowType): string => {
    switch (type) {
      case "generator":
        return "Code Generator"
      case "html":
        return "HTML Editor"
      case "css":
        return "CSS Editor"
      case "preview":
        return "Website Preview"
      case "ai":
        return "AI Assistant"
      case "code-editor":
        return "Code Editor"
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Set initial window sizes based on screen dimensions
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024
    const screenHeight = typeof window !== "undefined" ? window.innerHeight - TASKBAR_HEIGHT : 768 - TASKBAR_HEIGHT
    const aiWidth = screenWidth * 0.3 // 30% of screen width for AI Assistant
    const aiHeight = screenHeight * 0.4 // 40% of screen height for AI Assistant

    setOpenWindows([
      {
        type: "ai",
        title: "AI Assistant",
        content: "",
        position: { x: 0, y: 0 },
        size: { width: aiWidth, height: aiHeight },
        zoom: 1,
        isMinimized: false,
        zIndex: 1,
      },
      {
        type: "preview",
        title: "Website Preview",
        content: "",
        position: { x: aiWidth, y: 0 },
        size: { width: screenWidth - aiWidth, height: screenHeight },
        zoom: 1,
        isMinimized: false,
        zIndex: 2,
      },
      {
        type: "code-editor",
        title: "Code Editor",
        content: "",
        position: { x: 0, y: aiHeight },
        size: { width: aiWidth, height: screenHeight - aiHeight },
        zoom: 1,
        isMinimized: false,
        zIndex: 3,
      },
    ])

    return () => clearInterval(timer)
  }, [])

  const bringToFront = useCallback(
    (type: WindowType) => {
      setNextZIndex((prev) => prev + 1)
      setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, zIndex: nextZIndex } : w)))
    },
    [nextZIndex],
  )

  const handleCommand = async (command: string) => {
    setCommandHistory((prev) => [...prev, `> ${command}`])

    if (command.toLowerCase() === "help") {
      setCommandHistory((prev) => [
        ...prev,
        "Available commands:",
        "add-heading <text> - Adds a heading to the page",
        "add-text <text> - Adds a paragraph of text",
        "change-color <color> - Changes the background color",
        "add-button <text> - Adds a button",
        "clear - Clears the console",
        "open <type> - Opens a window (generator, html, css, preview, ai, code-editor)",
        "close <type> - Closes a window (generator, html, css, preview, ai, code-editor)",
        "ai <prompt> - Send a prompt to the AI assistant to style the website",
        "You can also click on the HTML and CSS windows to edit the code directly.",
      ])
      return
    }

    if (command.toLowerCase() === "clear") {
      setCommandHistory([])
      return
    }

    if (command.toLowerCase().startsWith("open ")) {
      const windowType = command.toLowerCase().split(" ")[1] as WindowType
      handleOpenWindow(windowType)
      return
    }

    if (command.toLowerCase().startsWith("close ")) {
      const windowType = command.toLowerCase().split(" ")[1] as WindowType
      handleCloseWindow(windowType)
      return
    }

    if (command.toLowerCase().startsWith("ai ")) {
      const prompt = command.slice(3)
      await handleAIPrompt(prompt)
      return
    }

    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, currentCode: websiteCode }),
      })

      if (!response.ok) {
        throw new Error("Error generating code")
      }

      const newCode = await response.json()
      setWebsiteCode(newCode)
      setCommandHistory((prev) => [...prev, "Code has been generated successfully."])
    } catch (error) {
      console.error("Error in handleCommand:", error)
      setCommandHistory((prev) => [...prev, "An error occurred while generating the code."])
    }
  }

  const handleCodeChange = (type: "html" | "css", newCode: string) => {
    setWebsiteCode((prev) => ({ ...prev, [type]: newCode }))
  }

  const handleSave = () => {
    // Download HTML file
    downloadFile(websiteCode.html, "index.html", "text/html")

    // Download CSS file
    downloadFile(websiteCode.css, "styles.css", "text/css")

    setCommandHistory((prev) => [...prev, "HTML and CSS files have been downloaded."])
  }

  const handleOpenWindow = useCallback(
    (type: WindowType) => (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!openWindows.some((w) => w.type === type)) {
        const newWindow = {
          type,
          title: getWindowTitle(type),
          content: "",
          position: { x: 20, y: 20 },
          size: {
            width: type === "html" || type === "css" ? 600 : 400,
            height: type === "html" || type === "css" ? 400 : 300,
          },
          zoom: 1,
          isMinimized: false,
          zIndex: nextZIndex,
        }
        setNextZIndex((prev) => prev + 1)
        setOpenWindows((prev) => [...prev, newWindow])
      } else {
        bringToFront(type)
        setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, isMinimized: false } : w)))
      }
    },
    [openWindows, nextZIndex, bringToFront, getWindowTitle],
  )

  const handleCloseWindow = (type: WindowType) => {
    setOpenWindows((prev) => prev.filter((w) => w.type !== type))
  }

  const handleAIResponse = (response: string) => {
    setCommandHistory((prev) => [...prev, "AI: " + response])
  }

  const handleCodeGenerated = (html: string, css: string) => {
    setWebsiteCode({ html, css, js: "" })
  }

  const handleAIPrompt = async (prompt: string) => {
    setCommandHistory((prev) => [...prev, `AI Query: ${prompt}`])
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || "Failed to process the command")
      }

      // Update the website code with AI-generated HTML and CSS
      handleCodeGenerated(data.html, data.css)

      setCommandHistory((prev) => [
        ...prev,
        `AI Response: Website updated with AI-generated code.`,
        `HTML: ${data.html.substring(0, 100)}...`, // Show first 100 characters of HTML
        `CSS: ${data.css.substring(0, 100)}...`, // Show first 100 characters of CSS
      ])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setCommandHistory((prev) => [
        ...prev,
        `Error: ${error.message || "An error occurred while processing the AI request."}`,
        "Please try again with a different prompt or check the console for more details.",
      ])
    }
  }

  const handleZoomIn = (type: WindowType) => {
    setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, zoom: Math.min(w.zoom + 0.1, 2) } : w)))
  }

  const handleZoomOut = (type: WindowType) => {
    setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, zoom: Math.max(w.zoom - 0.1, 0.5) } : w)))
  }

  const toggleMinimize = (type: WindowType) => {
    setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, isMinimized: !w.isMinimized } : w)))
  }

  const handleDrag = (type: WindowType, newPosition: { x: number; y: number }) => {
    bringToFront(type)
    const maxY = window.innerHeight - TASKBAR_HEIGHT - openWindows.find((w) => w.type === type)!.size.height
    const adjustedPosition = {
      x: newPosition.x,
      y: Math.min(Math.max(newPosition.y, 0), maxY),
    }
    setOpenWindows((prev) => prev.map((w) => (w.type === type ? { ...w, position: adjustedPosition } : w)))
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono relative overflow-hidden">
      <div className="scanlines pointer-events-none"></div>
      <div className="glow pointer-events-none"></div>

      {openWindows.map((window) =>
        window.isMinimized ? (
          <motion.div
            key={window.type}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => bringToFront(window.type)}
            initial={window.position}
            style={{
              position: "absolute",
              width: 100,
              height: 30,
              zIndex: window.zIndex,
            }}
          >
            <div
              className="border border-[#00ff00] bg-black/90 backdrop-blur h-full flex flex-col justify-center items-center cursor-pointer"
              onClick={() => toggleMinimize(window.type)}
            >
              <span className="text-[#00ff00] font-bold text-center">{window.title}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={window.type}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => bringToFront(window.type)}
            onDrag={(event, info) => handleDrag(window.type, info.point)}
            initial={window.position}
            style={{
              position: "absolute",
              width: window.size.width,
              height: window.size.height,
              transform: `scale(${window.zoom})`,
              transformOrigin: "top left",
              zIndex: window.zIndex,
            }}
          >
            <div
              className={`border border-[#00ff00] bg-black/90 backdrop-blur h-full flex flex-col ${window.type === "preview" ? "glow-intense preview-window" : ""}`}
            >
              <div className="border-b border-[#00ff00] p-2 flex justify-between items-center cursor-move bg-[#003300]">
                <span className="text-[#00ff00] font-bold">{window.title}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleZoomOut(window.type)}
                    className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleZoomIn(window.type)}
                    className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleMinimize(window.type)}
                    className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCloseWindow(window.type)}
                    className="text-[#00ff00] text-2xl font-bold hover:text-[#00ff00]/70 transition-colors"
                  >
                    X
                  </button>
                </div>
              </div>
              <div className="flex-grow overflow-hidden" style={{ fontSize: `${14 * window.zoom}px` }}>
                {window.type === "preview" ? (
                  <WebsitePreview code={websiteCode} />
                ) : window.type === "ai" ? (
                  <AIPanel onAIResponse={handleAIResponse} onCodeGenerated={handleCodeGenerated} />
                ) : window.type === "code-editor" ? (
                  <CodeEditor
                    html={websiteCode.html}
                    css={websiteCode.css}
                    onHtmlChange={(newHtml) => handleCodeChange("html", newHtml)}
                    onCssChange={(newCss) => handleCodeChange("css", newCss)}
                  />
                ) : window.type === "generator" ? (
                  <DraggableWindow
                    title={window.title}
                    content={commandHistory.join("\n")}
                    onCommand={handleCommand}
                    onClose={() => handleCloseWindow(window.type)}
                    onMinimize={() => toggleMinimize(window.type)}
                    onZoomIn={() => handleZoomIn(window.type)}
                    onZoomOut={() => handleZoomOut(window.type)}
                    initialPosition={window.position}
                    initialSize={window.size}
                    zoom={window.zoom}
                  />
                ) : window.type === "html" || window.type === "css" ? (
                  <textarea
                    value={websiteCode[window.type]}
                    onChange={(e) => handleCodeChange(window.type, e.target.value)}
                    className="w-full h-full bg-black text-[#00ff00] border-none resize-none p-2 focus:outline-none"
                    spellCheck="false"
                  />
                ) : null}
              </div>
            </div>
          </motion.div>
        ),
      )}

      <SystemBar
        time={time}
        onSave={handleSave}
        onOpenWindow={handleOpenWindow}
        openWindows={openWindows}
        className="fixed bottom-0 left-0 right-0 h-[40px] z-10"
      />

      <style jsx global>{`
        .scanlines::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            transparent 0px,
            rgba(0, 255, 0, 0.05) 1px,
            transparent 2px
          );
          pointer-events: none;
        }

        .glow {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 50px rgba(0, 255, 0, 0.3);
          pointer-events: none;
        }

        .preview-window {
          box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.5);
        }

        .glow-intense {
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.1);
        }

        * {
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
        }
      `}</style>
    </div>
  )
}

