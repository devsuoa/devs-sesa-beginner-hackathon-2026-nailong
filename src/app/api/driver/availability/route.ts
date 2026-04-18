// src/app/api/driver/availability/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { status } = await req.json(); // "ONLINE" | "OFFLINE"

	if (!["ONLINE", "OFFLINE"].includes(status)) {
		return NextResponse.json({ error: "Invalid status" }, { status: 400 });
	}

	const driver = await prisma.driverProfile.update({
		where: { profileId: user.id },
		data: { status },
	});

	return NextResponse.json({ driver });
}
