export default function Ride() {
  return <div>
    {/* Pick Up */}
					
    <div className="relative w-full mb-8 flex items-center gap-4">
      <span className="corner-pip corner-pip--tl" />
      <span className="corner-pip corner-pip--tr" />
      <span className="corner-pip corner-pip--bl" />
      <span className="corner-pip corner-pip--br" />

      <label className="w-1/3">PICK UP</label>

      <input
        type="text"
        placeholder="Earth 🌍"
        className="w-2/3 h-12 px-4
        bg-black/40 border border-white/20
        text-white placeholder-white/30
        backdrop-blur-md outline-none
        tracking-wide
        transition-all duration-300
        focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(100,200,255,0.5)]"
      />
    </div>
    

    {/* Drop Off */}
    
    <div className="relative w-full mb-8 flex items-center gap-4">
      <span className="corner-pip corner-pip--tl" />
      <span className="corner-pip corner-pip--tr" />
      <span className="corner-pip corner-pip--bl" />
      <span className="corner-pip corner-pip--br" />

      <label className="w-1/3">DROP OFF</label>

      <input
        type="text"
        placeholder="Mars 🔴"
        className="w-2/3 h-12 px-4
  bg-black/40 border border-white/20
  text-white placeholder-white/30
  backdrop-blur-md outline-none
  tracking-wide
  transition-all duration-300
  focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(100,200,255,0.5)]"
      />
    </div>
    

    {/* Submit Button */}
    
    <button
      className="relative w-full h-16 flex items-center justify-center mb-4
      text-white tracking-[0.2em] text-sm
      border border-white/20 bg-black/40 backdrop-blur-md
      transition-all duration-300
      hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
      active:scale-95"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <span className="corner-pip corner-pip--tl" />
      <span className="corner-pip corner-pip--tr" />
      <span className="corner-pip corner-pip--bl" />
      <span className="corner-pip corner-pip--br" />
      SUBMIT
    </button>
					
  </div>
}