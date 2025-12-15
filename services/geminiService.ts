import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { Truck, InsightResult } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFleetEfficiency = async (truck: Truck): Promise<InsightResult[]> => {
  try {
    const prompt = `
      Analyze the following telemetry data for a semi-truck to detect fuel anomalies.
      
      Truck ID: ${truck.id}
      Status: ${truck.status}
      Current Fuel Level: ${truck.fuelLevel}%
      Current MPG: ${truck.currentMpg}
      Recent History (Last 5 points): ${JSON.stringify(truck.history.slice(-5))}

      Identify 3 key insights regarding fuel efficiency, potential theft (rapid drop while stopped), or idling waste.
      Return the response as a JSON object containing a list of insights.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["low", "medium", "critical"] },
              recommendation: { type: Type.STRING }
            },
            required: ["title", "description", "severity", "recommendation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InsightResult[];
    }
    return [];
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return [{
      title: "Analysis Unavailable",
      description: "Could not connect to AI service.",
      severity: "low",
      recommendation: "Check network connection."
    }];
  }
};

export const chatWithFleetAI = async (
  message: string, 
  trucks: Truck[], 
  history: {role: 'user' | 'model', text: string}[]
): Promise<string> => {
  try {
    // We inject the current fleet state into the system instruction for every turn
    // to ensure the AI always answers based on the latest live data.
    const fleetContext = trucks.map(t => 
      `ID: ${t.id}, Name: ${t.name}, Driver: ${t.driver}, Status: ${t.status}, Fuel: ${t.fuelLevel}%, Location: ${t.location}`
    ).join('\n');

    const systemInstruction = `
      You are the Orca Cargo Fleet Assistant. 
      You have real-time access to the fleet data. 
      
      CURRENT FLEET STATUS:
      ${fleetContext}
      
      Answer the user's questions about the fleet. 
      Be concise, professional, and helpful. 
      If a truck has low fuel (<20%), warn the user.
      Do not invent data that is not in the context.
    `;

    // Convert history to API format
    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I'm having trouble connecting to the fleet network right now.";
  }
};