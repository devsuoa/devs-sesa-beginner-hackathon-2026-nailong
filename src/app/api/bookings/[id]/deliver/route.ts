// src/app/api/bookings/[id]/deliver/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const PLATFORM_FEE = 0.25; // OrbitX takes 25%

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

	const booking = await prisma.booking.findUnique({
		where: { id },
	});

	if (!booking) {
		return NextResponse.json({ error: "Booking not found" }, { status: 404 });
	}

	if (booking.driverId !== driverProfile.id) {
		return NextResponse.json({ error: "Not your booking" }, { status: 403 });
	}

	if (booking.status !== "CONFIRMED" && booking.status !== "IN_TRANSIT") {
		return NextResponse.json(
			{ error: "Booking cannot be delivered" },
			{ status: 400 },
		);
	}

	// Complete in a transaction — update booking + create earning + free up driver
	const updated = await prisma.$transaction(async (tx) => {
		const b = await tx.booking.update({
			where: { id },
			data: {
				status: "DELIVERED",
				actualArrival: new Date(),
			},
		});

		await tx.earning.create({
			data: {
				driverId: driverProfile.id,
				bookingId: id,
				grossCredits: booking.priceCredits,
				platformFee: Math.round(booking.priceCredits * PLATFORM_FEE),
				netCredits: Math.round(booking.priceCredits * (1 - PLATFORM_FEE)),
			},
		});

		await tx.driverProfile.update({
			where: { id: driverProfile.id },
			data: {
				status: "ONLINE",
				totalTrips: { increment: 1 },
			},
		});

		await tx.riderProfile.update({
			where: { id: booking.riderId },
			data: { totalTrips: { increment: 1 } },
		});

		return b;
	});

	return NextResponse.json({ booking: updated });
}
