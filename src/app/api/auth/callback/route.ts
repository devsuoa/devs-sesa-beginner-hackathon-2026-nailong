import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
	const { searchParams, origin } = new URL(req.url);
	const code = searchParams.get("code");
	const role = (searchParams.get("role") ?? "rider") as "rider" | "driver";

	if (!code) {
		return NextResponse.redirect(`${origin}/auth?error=missing_code`);
	}

	const supabase = await createClient();
	const {
		data: { session },
		error,
	} = await supabase.auth.exchangeCodeForSession(code);

	if (error || !session) {
		return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
	}

	// Upsert profile + role-specific profile on first login
	const existing = await prisma.profile.findUnique({
		where: { id: session.user.id },
	});

	if (!existing) {
		await prisma.profile.create({
			data: {
				id: session.user.id,
				email: session.user.email ?? "",
				role: role === "driver" ? "DRIVER" : "RIDER",
				firstName: session.user.user_metadata?.first_name,
				lastName: session.user.user_metadata?.last_name ?? null,
				...(role === "rider"
					? { rider: { create: {} } }
					: {
							driver: {
								create: {
									vesselName: "Unnamed Vessel",
									vesselType: "SHUTTLE",
								},
							},
						}),
			},
		});
	}

	// Redirect based on role
	const profile =
		existing ??
		(await prisma.profile.findUnique({
			where: { id: session.user.id },
			select: { role: true },
		}));

	const destination = profile?.role === "DRIVER" ? "/drive" : "/ride";
	return NextResponse.redirect(`${origin}${destination}`);
}
