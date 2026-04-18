"use client";

import Image from "next/image";

export default function Home() {
	return (
		<div className="relative min-h-screen flex items-center justify-center px-8">
			<div className="flex w-full max-w-6xl items-center justify-between gap-10">
				{/* LEFT: Image */}
				<div className="w-1/2 flex justify-center">
					<Image
						src="/landingPlanet.png"
						alt="Landing Planet"
						width={400}
						height={400}
						className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-[float_6s_ease-in-out_infinite] scale-140"
					/>
				</div>

				{/* RIGHT: Title*/}
				<div className="w-1/2 flex flex-col items-center">
					<h1
						className="mb-8 text-center text-4xl md:text-5xl font-black tracking-[0.15em] text-white animate-[float_6s_ease-in-out_infinite] hover:tracking-[0.25em] transition-all duration-500"
						style={{
							textShadow:
								"0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
						}}
					>
						NAILONG EXPRESS
					</h1>
				</div>
			</div>
		</div>
	);
}
