import OpenAI from "openai";
import { AI_MODELS } from "./config";
import { systemPrompt, userPrompt } from "./prompt";
import type { AIResult, GenerateAIInput } from "./types";

export async function generateOpenAI(input: GenerateAIInput): Promise<AIResult> {
  if (!process.env.OPENAI_API_KEY) throw new Error("MISSING_OPENAI_KEY");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const content = [{ type: "input_text" as const, text: userPrompt(input.productData) }, ...input.images.map(image_url => ({ type: "input_image" as const, image_url, detail: "low" as const }))];
  const response = await client.responses.create({ model: AI_MODELS.openai, instructions: systemPrompt, input: [{ role: "user", content }], text: { format: { type: "json_object" } } });
  return JSON.parse(response.output_text) as AIResult;
}
