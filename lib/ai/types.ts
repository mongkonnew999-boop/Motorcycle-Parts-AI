export type AIProvider = "openai" | "gemini";

export type ProductData = { name: string; brand: string; vehicleModel: string; year: string; partCode: string; description: string; channel: "TikTok" | "Shopee"; sceneCount: number; lens: "Hero" | "Macro"; character?: string; scene?: string };
export type AIResult = { analysis: { productName: string; productType: string; shape: string; color: string; material: string; estimatedSize: string; compatibleModels: string[]; sellingPoints: string[]; recommendedCharacter: string; recommendedScene: string }; imagePrompt: string; videoScenes: { scene: number; videoPrompt: string; thaiSpeech: string }[]; caption: string; hashtags: string[] };
export type GenerateAIInput = { provider: AIProvider; task: "generate" | "test"; productData: ProductData; images: string[] };
