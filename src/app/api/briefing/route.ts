import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const destinationId = searchParams.get("destinationId");
  const serviceType = searchParams.get("serviceType");

  if (!destinationId || !serviceType) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const destination = await prisma.location.findUnique({ where: { id: destinationId } });
  if (!destination) return NextResponse.json({ error: "Location not found" }, { status: 404 });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: `You are an automated travel briefing system for OrbitX, a space transport service in 2157.
Write a 2-3 sentence briefing for the passenger. Be specific about conditions and practical advice.
Tone: professional but warm. Plain text only, no markdown.`,
      },
      {
        role: "user",
        content: `Destination: ${destination.name}
Conditions: ${destination.currentConditions ?? "clear"}
Service: ${serviceType}
Description: ${destination.description ?? ""}`,
      },
    ],
  });

  const briefing = response.choices[0]?.message?.content ?? null;
  return NextResponse.json({ briefing });
}