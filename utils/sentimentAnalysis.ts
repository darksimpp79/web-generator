import { HfInference } from "@huggingface/inference"

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function analyzeSentiment(text: string) {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY is not set")
    }
    const result = await inference.textClassification({
      model: "cardiffnlp/twitter-roberta-base-sentiment-latest",
      inputs: text,
    })
    return result
  } catch (error) {
    console.error("Error in sentiment analysis:", error instanceof Error ? error.message : String(error))
    throw new Error(`Sentiment analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

