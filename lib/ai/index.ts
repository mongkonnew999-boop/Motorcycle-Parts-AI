import { generateGemini } from "./gemini";
import { generateOpenAI } from "./openai";
import type { AIResult, GenerateAIInput } from "./types";
export type { AIProvider, AIResult, GenerateAIInput, ProductData } from "./types";
export async function generateAI(input: GenerateAIInput): Promise<AIResult> { return input.provider === "openai" ? generateOpenAI(input) : generateGemini(input); }
export function providerConfigured(provider: "openai" | "gemini") { return provider === "openai" ? Boolean(process.env.OPENAI_API_KEY) : Boolean(process.env.GEMINI_API_KEY); }
