import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth"];

export async function proxy(req: NextRequest) {
	let res = NextResponse.next({ request: req });
	const path = req.nextUrl.pathname;

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return req.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => {
						req.cookies.set(name, value);
					});
					res = NextResponse.next({ request: req });
					cookiesToSet.forEach(({ name, value, options }) => {
						res.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const isPublic =
		PUBLIC_ROUTES.some((r) => path === r) || path.startsWith("/api/auth");

	// Block unauthenticated users
	if (!user && !isPublic) {
		return NextResponse.redirect(new URL("/api/auth/login", req.url));
	}

	// Send logged-in users away from /auth
	if (user && path === "/api/auth/login") {
		return NextResponse.redirect(new URL("/ride", req.url));
	}

	if (user && !isPublic) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("roles")
			.eq("id", user.id)
			.single();

		const hasRoles = profile?.roles && profile.roles.length > 0;

		if (!hasRoles && path !== "/onboarding") {
			return NextResponse.redirect(new URL("/onboarding", req.url));
		}

		if (hasRoles && path === "/onboarding") {
			return NextResponse.redirect(new URL("/account", req.url));
		}
	}

	return res;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
