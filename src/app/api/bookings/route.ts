// src/app/api/bookings/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
// import Anthropic from "@anthropic-ai/sdk";

// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function GET() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const bookings = await prisma.booking.findMany({
		where: { rider: { profileId: user.id } },
		include: {
			origin: true,
			destination: true,
			driver: {
				include: { profile: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { originId, destinationId, serviceType } = await req.json();

	// Validate required fields
	if (!originId || !destinationId || !serviceType) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 },
		);
	}

	if (originId === destinationId) {
		return NextResponse.json(
			{ error: "Origin and destination cannot be the same" },
			{ status: 400 },
		);
	}

	// Get rider profile
	const riderProfile = await prisma.riderProfile.findUnique({
		where: { profileId: user.id },
	});

	if (!riderProfile) {
		return NextResponse.json(
			{ error: "Rider profile not found" },
			{ status: 404 },
		);
	}

	// Fetch both locations
	const [origin, destination] = await Promise.all([
		prisma.location.findUnique({ where: { id: originId } }),
		prisma.location.findUnique({ where: { id: destinationId } }),
	]);

	if (!origin || !destination) {
		return NextResponse.json({ error: "Invalid location" }, { status: 400 });
	}

	// Calculate price + ETA
	const travelTimes = origin.travelTimes as Record<string, number>;
	const travelMinutes = travelTimes?.[destinationId] ?? 60;
	const basePrices = { SHUTTLE: 80, CARGO: 120, FOOD: 50 };
	const basePrice = basePrices[serviceType as keyof typeof basePrices] ?? 80;
	const priceCredits = basePrice + Math.round(travelMinutes * 0.5);
	const departureTime = new Date();
	const estimatedArrival = new Date(Date.now() + travelMinutes * 60 * 1000);

	// Create booking
	const booking = await prisma.booking.create({
		data: {
			riderId: riderProfile.id,
			originId,
			destinationId,
			serviceType,
			status: "PENDING",
			priceCredits,
			departureTime,
			estimatedArrival,
		},
		include: {
			origin: true,
			destination: true,
		},
	});

	// Generate Claude briefing async — don't block the response
	// generateBriefing(booking.id, destination, serviceType, travelMinutes);

	return NextResponse.json({ booking }, { status: 201 });
}

// Runs after response is returned
// async function generateBriefing(
//   bookingId: string,
//   destination: { name: string; description: string | null; currentConditions: string | null },
//   serviceType: string,
//   travelMinutes: number
// ) {
//   try {
//     const response = await anthropic.messages.create({
//       model: "claude-sonnet-4-20250514",
//       max_tokens: 200,
//       system: `You are an automated travel briefing system for OrbitX, a space transport service in 2157.
// Write a 2-3 sentence briefing for the passenger. Be specific about conditions and practical advice.
// Tone: professional but warm. Plain text only, no markdown.`,
//       messages: [{
//         role: "user",
//         content: `Destination: ${destination.name}
// Conditions: ${destination.currentConditions ?? "clear"}
// Service: ${serviceType}
// Travel time: ${travelMinutes} minutes
// Description: ${destination.description ?? ""}`,
//       }],
//     });

//     const briefing = response.content[0].type === "text"
//       ? response.content[0].text
//       : null;

//     if (briefing) {
//       await prisma.booking.update({
//         where: { id: bookingId },
//         data: { aiBriefing: briefing },
//       });
//     }
//   } catch (err) {
//     console.error("Briefing generation failed:", err);
//   }
// }
