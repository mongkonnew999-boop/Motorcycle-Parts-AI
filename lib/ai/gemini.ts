import { GoogleGenAI } from "@google/genai";
import { AI_MODELS } from "./config";
import { systemPrompt, userPrompt } from "./prompt";
import type { AIResult, GenerateAIInput } from "./types";

export async function generateGemini(input: GenerateAIInput): Promise<AIResult> {
  if (!process.env.GEMINI_API_KEY) throw new Error("MISSING_GEMINI_KEY");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const parts = [{ text: `${systemPrompt}\n\n${userPrompt(input.productData)}` }, ...input.images.map(data => { const [head, base64] = data.split(","); return { inlineData: { mimeType: head.match(/data:(.*?);/)?.[1] || "image/jpeg", data: base64 } }; })];
  const response = await ai.models.generateContent({ model: AI_MODELS.gemini, contents: [{ role: "user", parts }], config: { responseMimeType: "application/json" } });
  return JSON.parse(response.text || "") as AIResult;
}
