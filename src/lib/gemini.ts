const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface PathPreferences {
  diet: number;
  exercise: number;
  medical: number;
  supplements: number;
}

export interface BodyGoals {
  [key: string]: number;
}

export interface RecommendationResult {
  summary: string;
  diet?: string;
  exercise?: string;
  medical?: string;
  supplements?: string;
  timeline?: string;
  disclaimer: string;
}

export function getGeminiKey(): string | null {
  return localStorage.getItem("modifAI_gemini_key");
}

export function setGeminiKey(key: string) {
  localStorage.setItem("modifAI_gemini_key", key);
}

export function removeGeminiKey() {
  localStorage.removeItem("modifAI_gemini_key");
}

export async function getRecommendation(
  bodyGoals: BodyGoals,
  pathPreferences: PathPreferences,
  apiKey: string
): Promise<RecommendationResult> {
  // Build a human-readable summary of what the user wants to change
  const goalDescriptions = Object.entries(bodyGoals)
    .filter(([_, val]) => val !== 50)
    .map(([key, val]) => {
      const direction = val > 50 ? "increase" : "decrease";
      const intensity = Math.abs(val - 50);
      const label = key.replace(/([A-Z])/g, " $1").toLowerCase().trim();
      return `${label}: ${direction} by ${intensity}% intensity`;
    });

  const pathSummary = Object.entries(pathPreferences)
    .filter(([_, pct]) => pct > 0)
    .map(([method, pct]) => `${method}: ${pct}%`)
    .join(", ");

  const prompt = `You are a body transformation advisor. A user wants to achieve certain body changes and has specified how they'd like to approach it.

**Body modification goals (from current baseline of 50%):**
${goalDescriptions.length > 0 ? goalDescriptions.join("\n") : "No specific changes set yet."}

**Preferred approach breakdown:**
${pathSummary || "No preferences set yet."}

Based on these goals and preferences, provide a specific, actionable transformation plan. Respond ONLY with valid JSON (no markdown, no code fences) in this exact format:
{
  "summary": "Brief 1-2 sentence overview of the plan",
  "diet": "Specific dietary recommendations if diet is part of the approach (or null if 0%)",
  "exercise": "Specific exercise recommendations if exercise is part of the approach (or null if 0%)",
  "medical": "Specific medical/professional recommendations if medical is part of the approach (or null if 0%)",
  "supplements": "Specific supplement recommendations if supplements are part of the approach (or null if 0%)",
  "timeline": "Estimated realistic timeline to see results",
  "disclaimer": "Brief medical disclaimer"
}

Be specific with exercise names, food recommendations, supplement names and dosages, and types of medical professionals. Tailor the depth of each section proportionally to its percentage in the approach.`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 400 && err.includes("API_KEY")) {
      throw new Error("Invalid API key. Please check your Gemini API key.");
    }
    if (response.status === 429) {
      throw new Error("Rate limited. Please wait a moment and try again.");
    }
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini.");

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  try {
    return JSON.parse(cleaned) as RecommendationResult;
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}
