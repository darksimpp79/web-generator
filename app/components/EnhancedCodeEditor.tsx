"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EnhancedCodeEditorProps {
  code: {
    html: string
    css: string
    js: string
  }
}

export default function EnhancedCodeEditor({ code }: EnhancedCodeEditorProps) {
  return (
    <Tabs defaultValue="html" className="h-full flex flex-col">
      <TabsList>
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="css">CSS</TabsTrigger>
        <TabsTrigger value="js">JavaScript</TabsTrigger>
      </TabsList>
      <ScrollArea className="flex-grow">
        <TabsContent value="html" className="p-4">
          <pre className="text-sm">
            <code>{code.html}</code>
          </pre>
        </TabsContent>
        <TabsContent value="css" className="p-4">
          <pre className="text-sm">
            <code>{code.css}</code>
          </pre>
        </TabsContent>
        <TabsContent value="js" className="p-4">
          <pre className="text-sm">
            <code>{code.js}</code>
          </pre>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

