import { NextResponse } from "next/server";
import { marked } from "marked";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.query || body?.message || "";

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message (query) is required." }, { status: 400 });
    }

    if (!process.env.GROK_API_KEY) {
      return NextResponse.json({ error: "GROK_API_KEY is not set in environment variables." }, { status: 500 });
    }

    const systemInstruction = `You are IPR-Assist, an expert AI assistant on Intellectual Property Rights (IPR).
Answer STRICTLY using your internal knowledge about Intellectual Property Rights (IPR), patents, trademarks, copyrights, etc of india country only .
If the requested information is NOT related to Intellectual Property Rights (IPR), answer EXACTLY: "I don't know it, please ask regarding IPR".
Do not answer general knowledge questions outside of IPR.
and greet if user greet you`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Grok API Error:", errorData);
      return NextResponse.json(
        { error: "Grok API error: " + (errorData.error?.message || "Unknown error") },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "I don't have enough information to answer that.";
    const htmlReply = marked.parse(replyText);

    return NextResponse.json({ response: htmlReply, reply: htmlReply });
  } catch (error) {
    console.error("Grok API Error:", error);
    return NextResponse.json(
      { error: "Unable to generate a response. Please try again." },
      { status: 500 }
    );
  }
}
