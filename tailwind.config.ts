import type { Config } from "tailwindcss";
 
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "monospace"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        scan: {
          "0%":   { backgroundPosition: "-40% 0" },
          "100%": { backgroundPosition: "140% 0" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s infinite",
        scan: "scan 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
 
export default config;