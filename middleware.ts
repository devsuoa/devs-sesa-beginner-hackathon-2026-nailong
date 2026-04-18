// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth"];
// const RIDER_ROUTES = ["/ride"];
// const DRIVER_ROUTES = ["/drive"];

export async function middleware(req: NextRequest) {
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
		return NextResponse.redirect(new URL("/auth", req.url));
	}

	// Send logged-in users away from /auth
	if (user && path === "/auth") {
		return NextResponse.redirect(new URL("/ride", req.url));
	}

	return res;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
