import { NextResponse } from "next/server"
import axios from "axios"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const { command } = await request.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const prompt = `You are a website generator. Generate HTML and CSS code based on this request: ${command}

Your response must be a valid JSON object with exactly this structure:
{
  "html": "<html><head><title>Generated Page</title></head><body>... your generated HTML here ...</body></html>",
  "css": "/* your generated CSS here */"
}

Important:
- The response must be ONLY the JSON object, nothing else
- The HTML must be a complete page with html, head, and body tags
- All quotes must be properly escaped
- The CSS must be valid CSS rules`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const generatedContent = response.data.candidates[0].content.parts[0].text

    // Log the raw response for debugging
    console.log("Raw Gemini response:", generatedContent)

    // Try to extract JSON if the response contains it
    let jsonContent = generatedContent
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonContent = jsonMatch[0]
    }

    // Attempt to parse the generated content as JSON
    try {
      const parsedResponse = JSON.parse(jsonContent)
      if (!parsedResponse.html || !parsedResponse.css) {
        throw new Error("Response missing required fields")
      }
      return NextResponse.json({
        success: true,
        html: parsedResponse.html,
        css: parsedResponse.css,
      })
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.error("Attempted to parse:", jsonContent)
      return NextResponse.json({
        success: false,
        error: "Failed to parse AI response",
        details: "The AI generated an invalid response. Please try again with a different prompt.",
        rawContent: generatedContent,
      })
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      return NextResponse.json(
        { error: error.response?.data?.error?.message || "Error calling Gemini API" },
        { status: error.response?.status || 500 },
      )
    }

    console.error("Unknown error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

