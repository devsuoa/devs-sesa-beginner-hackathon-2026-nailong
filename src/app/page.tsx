import Starfield from "../components/Starfield";

export default function Home() {
  return (
    <div>
		<Starfield />
		<div className="w-1/4 h-16 bg-blue-200 flex items-center justify-center mb-4 text-black mx-auto rounded-lg">
			Pick Up Planet
		</div>
		<div className="w-1/4 h-16 bg-green-200 flex items-center justify-center mb-4 text-black mx-auto rounded-lg">
			Drop Off Planet
		</div>
		<button
			className="relative w-1/4 h-16 flex items-center justify-center mb-4 mx-auto
			text-white tracking-[0.2em] text-sm
			border border-white/20 bg-black/40 backdrop-blur-md
			transition-all duration-300
			hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
			active:scale-95"
			style={{ fontFamily: "'Share Tech Mono', monospace" }}
			>
			{/* Corner Pips */}
			<span className="corner-pip corner-pip--tl" />
			<span className="corner-pip corner-pip--tr" />
			<span className="corner-pip corner-pip--bl" />
			<span className="corner-pip corner-pip--br" />

			Submit
		</button>
    </div>
  );
}
