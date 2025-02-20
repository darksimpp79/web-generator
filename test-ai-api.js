import fetch from "node-fetch"

async function testAIAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "What is the capital of France?" }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("AI Response:", data.response)
  } catch (error) {
    console.error("Error testing AI API:", error)
  }
}

testAIAPI()

