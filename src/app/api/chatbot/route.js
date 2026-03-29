import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.query || body?.message || "";

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message (query) is required." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set in environment variables." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are IPR-Assist, an expert AI assistant on Intellectual Property Rights (IPR).
Answer STRICTLY using your internal knowledge about Intellectual Property Rights (IPR), patents, trademarks, copyrights, etc of india country only .
If the requested information is NOT related to Intellectual Property Rights (IPR), answer EXACTLY: "I don't know it, please ask regarding IPR".
Do not answer general knowledge questions outside of IPR.
and greet if user greet you`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      }
    });

    const replyText = response.text || "I don't have enough information to answer that.";
    const htmlReply = marked.parse(replyText);

    return NextResponse.json({ response: htmlReply, reply: htmlReply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Unable to generate a response. Please try again." },
      { status: 500 }
    );
  }
}
