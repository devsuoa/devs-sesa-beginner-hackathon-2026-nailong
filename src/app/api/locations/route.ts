// src/app/api/locations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const locations = await prisma.location.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});

	return NextResponse.json({ locations });
}
