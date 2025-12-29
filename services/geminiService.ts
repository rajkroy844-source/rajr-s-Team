
import { GoogleGenAI } from "@google/genai";
import { MovieAnalysis, RegionalData, ContinentalData } from "../types";

export const analyzeMovieRegionally = async (movieTitle: string): Promise<MovieAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Using GOOGLE SEARCH as your primary data source, analyze the movie "${movieTitle}" with a focus on current regional and continental performance. 
    
    IMPORTANT: You MUST use real-time search results to find:
    1. A concise, current summary of the movie's status.
    2. Global market highlights based on recent news.
    3. A detailed Regional Breakdown for specific major markets (e.g., USA, China, UK, Japan).
    4. A CONTINENTAL breakdown summarizing performance across Africa, Asia, Europe, North America, South America, and Oceania.
    
    Structure your response clearly. End with two JSON blocks:
    - DATA_BLOCK: Array of RegionalData objects.
    - CONTINENTAL_BLOCK: Array of ContinentalData objects.
    
    ContinentalData format: {"continent": "Asia", "marketShare": 45, "status": "Hyper-growth", "topCountry": "China"}
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
        title: chunk.web?.title || "Source"
      }))
      .filter(s => s.uri !== "");

    // Parsing Regional Data
    const dataBlockMatch = text.match(/DATA_BLOCK[\s\S]*?(\[[\s\S]*?\])/);
    let regionalBreakdown: RegionalData[] = [];
    if (dataBlockMatch?.[1]) {
      try {
        regionalBreakdown = JSON.parse(dataBlockMatch[1].replace(/```json|```/g, '').trim());
      } catch (e) { console.error("Regional parse error", e); }
    }

    // Parsing Continental Data
    const continentalBlockMatch = text.match(/CONTINENTAL_BLOCK[\s\S]*?(\[[\s\S]*?\])/);
    let continentalBreakdown: ContinentalData[] = [];
    if (continentalBlockMatch?.[1]) {
      try {
        continentalBreakdown = JSON.parse(continentalBlockMatch[1].replace(/```json|```/g, '').trim());
      } catch (e) { console.error("Continental parse error", e); }
    }

    const summaryMatch = text.match(/1\.\s+(.*?)(\n|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";
    
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
      regionalBreakdown,
      continentalBreakdown,
      sources: Array.from(new Set(sources.map(s => s.uri))).map(uri => sources.find(s => s.uri === uri)!)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze movie. Ensure search access is available.");
  }
};
