"use client"

import { useEffect, useRef } from "react"
import type { WebsiteCode } from "@/types/website"

interface WebsitePreviewProps {
  code: WebsiteCode
}

export default function WebsitePreview({ code }: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const document = iframeRef.current.contentDocument
      if (document) {
        document.open()
        document.write(`
          <!DOCTYPE html>
          ${code.html}
          <style>${code.css}</style>
          <script>${code.js}</script>
        `)
        document.close()
      }
    }
  }, [code])

  return (
    <div className="w-full h-full bg-black">
      <iframe ref={iframeRef} className="w-full h-full border-none bg-black" title="Website Preview" />
    </div>
  )
}

