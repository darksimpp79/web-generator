import type React from "react"
import { Twitter, Send } from "lucide-react"

type WindowType = string
interface Window {
  type: WindowType
  // other window properties
}

interface SystemBarProps {
  time: Date
  onSave: () => void
  onOpenWindow: (type: WindowType) => (e: React.MouseEvent) => void
  openWindows: Window[]
  className?: string
}

export default function SystemBar({ time, onSave, onOpenWindow, openWindows, className }: SystemBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t border-[#00ff00] bg-black/90 p-2 flex items-center gap-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <button
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs"
          onClick={onOpenWindow("generator")}
        >
          ⌨ Generator
        </button>
        <button
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs"
          onClick={onOpenWindow("html")}
        >
          📄 HTML
        </button>
        <button
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs"
          onClick={onOpenWindow("css")}
        >
          🎨 CSS
        </button>
        <button
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs"
          onClick={onOpenWindow("preview")}
        >
          👁 Preview
        </button>
        <button
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs"
          onClick={onOpenWindow("ai")}
        >
          🤖 AI Assistant
        </button>
        <button className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs" onClick={onSave}>
          💾 Save
        </button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="border border-[#00ff00] px-2 py-1 text-xs whitespace-nowrap">AI ▂▃▄▅▆▇</div>
        <div className="border border-[#00ff00] px-2 py-1 text-xs whitespace-nowrap">System ▂▃▄▅▆▇</div>
        <a
          href="https://x.com/AI_Web_Gen_BSC"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs flex items-center"
        >
          <Twitter className="w-4 h-4 mr-1" />X
        </a>
        <a
          href="https://t.me/aiwebgeneratorbsc"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs flex items-center"
        >
          <Send className="w-4 h-4 mr-1" />
          Telegram
        </a>
        <a
          href="https://four.meme/token/0x20c399e858200c62fa91d42ebe35150c78afcce3"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#00ff00] px-2 py-1 hover:bg-[#00ff00]/10 text-xs flex items-center"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          BUY
        </a>
        <div className="border border-[#00ff00] px-2 py-1 text-xs whitespace-nowrap">
          {time.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}

