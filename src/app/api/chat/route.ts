// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`
  : null;

const RETRY_STATUS_CODES = [429, 500, 502, 503, 504];
const MAX_RETRIES = 2;

async function callGeminiApi(payload: object) {
  let attempt = 0;

  while (true) {
    const response = await fetch(GEMINI_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok || attempt >= MAX_RETRIES || !RETRY_STATUS_CODES.includes(response.status)) {
      return response;
    }

    const waitMs = 500 + attempt * 700;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    attempt += 1;
  }
}

// ── System Prompt ────────────────────────────────────────
const SYSTEM_PROMPT = `তুমি Smart Inventory এর একজন বুদ্ধিমান AI সহকারী। তুমি:

1. **MCQ তৈরি করতে পারো** — যখন কেউ MCQ চাইবে তখন এই format এ দাও:
   MCQ_START
   প্রশ্ন: [প্রশ্ন লিখো]
   ক) [option]
   খ) [option]
   গ) [option]
   ঘ) [option]
   সঠিক উত্তর: [ক/খ/গ/ঘ]
   ব্যাখ্যা: [সংক্ষিপ্ত ব্যাখ্যা]
   MCQ_END

2. **Code লিখতে পারো** — সুন্দর formatted code দাও with explanation

3. **যেকোনো বিষয়ে প্রশ্নের উত্তর দাও** — বাংলা ও English দুটোতেই

4. **Practice quiz** — একাধিক MCQ একসাথে দিতে পারো

সবসময় সহায়ক, স্পষ্ট এবং শিক্ষার্থীবান্ধব ভাষায় উত্তর দাও।`;

// ── POST — AI Chat (MongoDB save নেই) ───────────────────
export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_URL) {
      return NextResponse.json(
        { error: "Gemini API key missing. Set GEMINI_API_KEY in .env.local." },
        { status: 500 }
      );
    }

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "message প্রয়োজন" },
        { status: 400 }
      );
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "বুঝেছি! আমি Smart Inventory এর AI Assistant। কীভাবে সাহায্য করতে পারি?" }],
      },
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const geminiRes = await callGeminiApi({
      contents,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error("Gemini API response error:", geminiRes.status, err);
      const errorMessage =
        geminiRes.status === 503
          ? "Gemini AI অস্থায়ীভাবে ব্যস্ত। কিছুক্ষণের মধ্যে আবার চেষ্টা করুন।"
          : "Gemini API সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।";

      return NextResponse.json({ error: errorMessage }, { status: geminiRes.status });
    }

    const geminiData = await geminiRes.json();
    const assistantMessage =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "দুঃখিত, উত্তর পাওয়া যায়নি।";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    return NextResponse.json(
      { error: "Server সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}