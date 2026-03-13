import { NextResponse } from "next/server";

const FALLBACK_CHATBOT_URL = "http://127.0.0.1:10000/chat";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const chatbotUrl = process.env.CHATBOT_BACKEND_URL || FALLBACK_CHATBOT_URL;

    const backendResponse = await fetch(chatbotUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      cache: "no-store",
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Chatbot backend request failed." },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ reply: data?.reply || "I don't have enough information to answer that." });
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to chatbot backend. Set CHATBOT_BACKEND_URL correctly." },
      { status: 500 }
    );
  }
}
