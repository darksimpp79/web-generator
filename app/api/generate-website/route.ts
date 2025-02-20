import { NextResponse } from "next/server"
import type { WebsiteCode } from "@/types/website"

export async function POST(request: Request) {
  try {
    const { command, currentCode } = await request.json()
    const newCode: WebsiteCode = { ...currentCode }

    // Process commands
    const [cmd, ...args] = command.toLowerCase().split(" ")
    const content = args.join(" ")

    switch (cmd) {
      case "add-heading":
        newCode.html = newCode.html.replace("</div>", `<h1>${content}</h1></div>`)
        break

      case "add-text":
        newCode.html = newCode.html.replace("</div>", `<p>${content}</p></div>`)
        break

      case "change-color":
        newCode.css = `
          body { 
            font-family: Arial, sans-serif; 
            background-color: ${content};
          }
          .container { 
            padding: 20px; 
          }
        `
        break

      case "add-button":
        newCode.html = newCode.html.replace("</div>", `<button>${content}</button></div>`)
        newCode.css += `
          button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #45a049;
          }
        `
        break

      default:
        return NextResponse.json({ error: "Unknown command" }, { status: 400 })
    }

    return NextResponse.json(newCode)
  } catch (error) {
    console.error("Error in generate-website API:", error)
    return NextResponse.json({ error: "An error occurred while processing the command" }, { status: 500 })
  }
}

