
import { GoogleGenAI } from "@google/genai";
import { MovieAnalysis, RegionalData, ContinentalData, GlobalStats } from "../types";

export const analyzeMovieRegionally = async (movieTitle: string): Promise<MovieAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Using GOOGLE SEARCH as your data source, provide a deep global market analysis for the movie "${movieTitle}".
    
    You MUST extract:
    1. A concise summary of its current global standing.
    2. Global market highlights (major news, controversies, or records).
    3. Specific data for:
       - Regional Breakdown (USA, China, etc.)
       - Continental Breakdown (Asia, Europe, etc.)
       - Global Scoreboard (Total box office, critic/audience scores, release status).

    Structure your response clearly and end with three JSON blocks:
    - DATA_BLOCK: Array of RegionalData.
    - CONTINENTAL_BLOCK: Array of ContinentalData.
    - GLOBAL_STATS: A single object containing totalBoxOffice (string), criticScore (0-100), audienceScore (0-100), globalReachIndex (1-10), and releaseStatus.

    Example GLOBAL_STATS: {"totalBoxOffice": "$750M+", "criticScore": 85, "audienceScore": 92, "globalReachIndex": 9, "releaseStatus": "Post-Theatrical"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => ({
        uri: chunk.web?.uri || "",
        title: chunk.web?.title || "Search Result"
      }))
      .filter(s => s.uri !== "");

    // Parsing Helpers
    const parseBlock = <T>(marker: string, fallback: T): T => {
      const regex = new RegExp(`${marker}[\\s\\S]*?(\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\})`);
      const match = text.match(regex);
      if (match?.[1]) {
        try {
          return JSON.parse(match[1].replace(/```json|```/g, '').trim());
        } catch (e) { console.error(`Parse error for ${marker}`, e); }
      }
      return fallback;
    };

    const regionalBreakdown = parseBlock<RegionalData[]>("DATA_BLOCK", []);
    const continentalBreakdown = parseBlock<ContinentalData[]>("CONTINENTAL_BLOCK", []);
    const globalStats = parseBlock<GlobalStats>("GLOBAL_STATS", {
      totalBoxOffice: "N/A",
      criticScore: 0,
      audienceScore: 0,
      globalReachIndex: 0,
      releaseStatus: "Unknown"
    });

    const summaryMatch = text.match(/1\.\s+(.*?)(\n|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "Analysis complete.";
    
    const highlightsMatch = text.match(/2\.\s+([\s\S]*?)(3\.|$)/);
    const globalHighlights = highlightsMatch 
      ? highlightsMatch[1].split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
          .map(line => line.replace(/^[-*]\s*/, '').trim()) 
      : [];

    return {
      title: movieTitle,
      summary,
      globalHighlights,
      globalStats,
      regionalBreakdown,
      continentalBreakdown,
      sources: Array.from(new Set(sources.map(s => s.uri))).map(uri => sources.find(s => s.uri === uri)!)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to ground analysis in search data. Try a different title.");
  }
};
