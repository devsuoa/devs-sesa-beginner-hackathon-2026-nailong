import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
	const { searchParams, origin } = new URL(req.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.redirect(`${origin}/auth?error=missing_code`);
	}

	const supabase = await createClient();
	const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

	if (error || !session) {
		console.error("Supabase auth error:", error);
		return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
	}

	try {
		const existing = await prisma.profile.findUnique({
			where: { id: session.user.id },
		});

		if (!existing) {
			await prisma.profile.create({
				data: {
					id: session.user.id,
					email: session.user.email ?? "",
					roles: [],
					firstName: session.user.user_metadata?.first_name ?? "",
					lastName: session.user.user_metadata?.last_name ?? null
				},
			});

			return NextResponse.redirect(`${origin}/onboarding`);
		}

		return NextResponse.redirect(`${origin}`);

	} catch (err) {
		console.error("Prisma error:", err);
		return NextResponse.redirect(`${origin}?error=db_failed`);
	}
}