"use client"

import { useEffect, useRef } from "react"

interface EnhancedWebsitePreviewProps {
  code: {
    html: string
    css: string
    js: string
  }
}

export default function EnhancedWebsitePreview({ code }: EnhancedWebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const document = iframeRef.current.contentDocument
      if (document) {
        document.open()
        document.write(`
          <html>
            <head>
              <style>${code.css}</style>
            </head>
            <body>
              ${code.html}
              <script>${code.js}</script>
            </body>
          </html>
        `)
        document.close()
      }
    }
  }, [code])

  return (
    <div className="h-full border rounded">
      <iframe ref={iframeRef} className="w-full h-full border-none" title="Website Preview" />
    </div>
  )
}

