// src/app/api/bookings/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(
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

	const booking = await prisma.booking.findUnique({
		where: { id },
		include: {
			origin: true,
			destination: true,
			rider: { include: { profile: true } },
			driver: { include: { profile: true } },
		},
	});

	if (!booking) {
		return NextResponse.json({ error: "Booking not found" }, { status: 404 });
	}

	return NextResponse.json({ booking });
}
