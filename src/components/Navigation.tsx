/** biome-ignore-all lint/a11y/noSvgWithoutTitle: yes */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Starfield from "./Starfield";

const NAV_LINKS = [
	{ label: "HOME", href: "/" },
	{ label: "BOOK", href: "/book" },
	{ label: "TRACK", href: "/track" },
	{ label: "ORDERS", href: "/orders" },
];

function CornerPips() {
	return (
		<>
			<span className="corner-pip corner-pip--tl" />
			<span className="corner-pip corner-pip--tr" />
			<span className="corner-pip corner-pip--bl" />
			<span className="corner-pip corner-pip--br" />
		</>
	);
}

function GoogleIcon() {
	return (
		<svg
			className="w-3.5 h-3.5 shrink-0"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#fff"
				opacity="0.9"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#fff"
				opacity="0.7"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
				fill="#fff"
				opacity="0.5"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#fff"
				opacity="0.6"
			/>
		</svg>
	);
}

export default function Navigation() {
	const pathname = usePathname();

	function handleGoogleLogin() {
		console.log("Google login triggered");
	}

	return (
		<>
			<Starfield />

			{/* Grid overlay */}
			<div
				className="fixed inset-0 pointer-events-none z-1"
				style={{
					backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
					backgroundSize: "40px 40px",
				}}
			/>

			<nav className="relative z-10 flex items-center justify-between px-8 h-16 border-b border-white/8 bg-black/60 backdrop-blur-xl">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5 no-underline">
					<div>
						<span
							className="font-black text-lg tracking-[0.12em] text-white"
							style={{
								fontFamily: "'Orbitron', monospace",
								textShadow:
									"0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
							}}
						>
							NAILONG EXPRESS
						</span>
						<span
							className="block text-[10px] tracking-[0.3em] text-white/45 font-normal -mt-0.5"
							style={{ fontFamily: "'Share Tech Mono', monospace" }}
						>
							YOUR ORBIT. YOUR RIDE.
						</span>
					</div>
				</Link>

				{/* Nav Links */}
				<ul className="flex items-center gap-1 list-none">
					{NAV_LINKS.map(({ label, href }) => {
						const isActive = pathname === href;
						return (
							<li key={href}>
								<Link
									href={href}
									className={`nav-link${isActive ? " nav-link--active" : ""}`}
								>
									<CornerPips />
									{label}
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Right side */}
				<div className="flex items-center justify-center gap-3">
					{/* Status indicator */}
					<div
						className="flex items-center gap-1.5 text-[9px] text-white/30 tracking-widest pr-4 border-r border-white/8"
						style={{ fontFamily: "'Share Tech Mono', monospace" }}
					>
						<div className="w-1.25 h-1.25 rounded-full bg-[rgba(100,255,180,0.9)] animate-pulse-dot shadow-[0_0_6px_rgba(100,255,180,0.8)]" />
						<span>SYS ONLINE</span>
					</div>

					{/* Sign in button */}
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="login-btn"
					>
						<GoogleIcon />
						SIGN IN
					</button>
				</div>

				{/* Scan line */}
				<div className="scan-line" />
			</nav>
		</>
	);
}
