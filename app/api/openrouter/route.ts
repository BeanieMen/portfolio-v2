import { NextRequest } from "next/server";
import { config } from "dotenv";

config();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.error(process.env.OPENROUTER_API_KEY);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: body.messages,
        max_tokens: 1024,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (typeof err == "object" && err) {
      return new Response(
        JSON.stringify({
          error: "message" in err ? err.message : "unknown error",
        }),
        { status: 500 }
      );
    }
  }
}
