"use client"

import { useState, useRef, useEffect } from "react"
import { useDragControls } from "framer-motion"
import ConsoleWindow from "./ConsoleWindow"
import { ZoomIn, ZoomOut, Minimize2 } from "lucide-react"

interface DraggableWindowProps {
  title: string
  content: string
  onCommand?: (command: string) => void
  onCodeChange?: (newCode: string) => void
  onClose: () => void
  onMinimize: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
  zoom: number
}

export default function DraggableWindow({
  title,
  content,
  onCommand,
  onCodeChange,
  onClose,
  onMinimize,
  onZoomIn,
  onZoomOut,
  initialPosition,
  initialSize,
  zoom,
}: DraggableWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const constraintsRef = useRef(null)
  const dragControls = useDragControls()

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [])

  const handleResize = (direction: string, movementX: number, movementY: number) => {
    setSize((prevSize) => {
      let newWidth = prevSize.width
      let newHeight = prevSize.height

      switch (direction) {
        case "right":
          newWidth = Math.max(200, prevSize.width + movementX)
          break
        case "bottom":
          newHeight = Math.max(200, prevSize.height + movementY)
          break
        case "left":
          newWidth = Math.max(200, prevSize.width - movementX)
          setPosition((prevPos) => ({ ...prevPos, x: prevPos.x + movementX }))
          break
        case "top":
          newHeight = Math.max(200, prevSize.height - movementY)
          setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + movementY }))
          break
      }

      return { width: newWidth, height: newHeight }
    })
  }

  return (
    <div ref={constraintsRef} className="border border-[#00ff00] bg-black/90 backdrop-blur flex flex-col h-full">
      <div
        className="border-b border-[#00ff00] p-2 flex justify-between items-center cursor-move bg-[#003300]"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <span className="text-[#00ff00] font-bold">{title}</span>
        <div className="flex items-center">
          <button onClick={onZoomOut} className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={onZoomIn} className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={onMinimize} className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors mr-2">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-[#00ff00] text-2xl font-bold hover:text-[#00ff00]/70 transition-colors"
          >
            X
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <ConsoleWindow
          title={title}
          content={content}
          onCommand={onCommand}
          onCodeChange={onCodeChange}
          className="h-full"
          zoom={zoom}
        />
      </div>
      {/* Resize handlers */}
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => {
          const handleMouseMove = (e: MouseEvent) => handleResize("left", e.movementX, 0)
          document.addEventListener("mousemove", handleMouseMove)
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", handleMouseMove)
            },
            { once: true },
          )
        }}
      />
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => {
          const handleMouseMove = (e: MouseEvent) => handleResize("right", e.movementX, 0)
          document.addEventListener("mousemove", handleMouseMove)
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", handleMouseMove)
            },
            { once: true },
          )
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => {
          const handleMouseMove = (e: MouseEvent) => handleResize("bottom", 0, e.movementY)
          document.addEventListener("mousemove", handleMouseMove)
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", handleMouseMove)
            },
            { once: true },
          )
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => {
          const handleMouseMove = (e: MouseEvent) => handleResize("top", 0, e.movementY)
          document.addEventListener("mousemove", handleMouseMove)
          document.addEventListener(
            "mouseup",
            () => {
              document.removeEventListener("mousemove", handleMouseMove)
            },
            { once: true },
          )
        }}
      />
    </div>
  )
}

