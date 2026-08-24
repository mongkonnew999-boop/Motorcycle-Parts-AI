import { NextResponse } from "next/server";
import { providerConfigured } from "../../../../lib/ai";
export async function GET() { return NextResponse.json({ openai: providerConfigured("openai"), gemini: providerConfigured("gemini") }); }
