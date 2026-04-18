// src/app/api/bookings/[id]/accept/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	const driverProfile = await prisma.driverProfile.findUnique({
		where: { profileId: user.id },
	});

	if (!driverProfile) {
		return NextResponse.json(
			{ error: "Driver profile not found" },
			{ status: 404 },
		);
	}

	if (driverProfile.status !== "ONLINE") {
		return NextResponse.json(
			{ error: "You must be online to accept jobs" },
			{ status: 400 },
		);
	}

	// Check booking is still available
	const booking = await prisma.booking.findUnique({
		where: { id },
	});

	if (!booking) {
		return NextResponse.json({ error: "Booking not found" }, { status: 404 });
	}

	if (booking.status !== "PENDING") {
		return NextResponse.json(
			{ error: "Booking is no longer available" },
			{ status: 409 },
		);
	}

	// Accept in a transaction — prevents two drivers accepting simultaneously
	const updated = await prisma.$transaction(async (tx) => {
		const b = await tx.booking.update({
			where: { id, status: "PENDING" }, // optimistic lock on status
			data: {
				driverId: driverProfile.id,
				status: "CONFIRMED",
			},
			include: {
				origin: true,
				destination: true,
			},
		});

		await tx.driverProfile.update({
			where: { id: driverProfile.id },
			data: { status: "ON_TRIP" },
		});

		return b;
	});

	return NextResponse.json({ booking: updated });
}
