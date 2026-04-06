import { useEffect, useState } from "react";

const BIOMETRIC_DATA = [
  { label: "Jawline Definition", value: "+40%", x: "15%", y: "15%", delay: 0 },
  { label: "Skin Tightening", value: "Firmer", x: "78%", y: "12%", delay: 0.4 },
  { label: "Waist Reduction", value: "−2 in", x: "82%", y: "35%", delay: 0.8 },
  { label: "Ab Definition", value: "+60%", x: "8%", y: "50%", delay: 1.2 },
  { label: "Glute Toning", value: "+35%", x: "80%", y: "58%", delay: 1.6 },
  { label: "Cellulite Reduction", value: "−70%", x: "16%", y: "80%", delay: 2.0 },
  { label: "Bicep Definition", value: "+45%", x: "75%", y: "80%", delay: 2.4 },
  { label: "V-Taper Enhancement", value: "+30%", x: "10%", y: "35%", delay: 2.8 },
];
];

function AnimatedValue({ target }: { target: string }) {
  const [display, setDisplay] = useState(target);
  const numMatch = target.match(/^([\d,]+\.?\d*)/);

  useEffect(() => {
    if (!numMatch) return;
    const finalNum = parseFloat(numMatch[1].replace(",", ""));
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * finalNum;
      const formatted = finalNum >= 100
        ? Math.round(current).toLocaleString()
        : current.toFixed(finalNum % 1 !== 0 ? 1 : 0);
      setDisplay(target.replace(numMatch[1], formatted));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, numMatch]);

  return <>{display}</>;
}

// Human silhouette SVG - slight 3/4 angle, no hair, no private parts, gender-neutral
function HumanSilhouette() {
  return (
    <svg
      viewBox="0 0 300 600"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 30px hsl(40 65% 55% / 0.15))" }}
    >
      {/* Scan line animation */}
      <defs>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0" />
          <stop offset="45%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.3" />
          <stop offset="55%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(40, 55%, 45%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(40, 45%, 35%)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="bodyEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Slight rotation transform for 3/4 angle effect */}
      <g transform="translate(150, 300) scale(0.92) skewY(-2) translate(-150, -300)">
        {/* Head */}
        <ellipse cx="153" cy="58" rx="32" ry="38" fill="url(#bodyGrad)" />

        {/* Neck */}
        <rect x="141" y="92" width="24" height="24" rx="8" fill="url(#bodyGrad)" />

        {/* Shoulders and torso */}
        <path
          d="M 90 116 Q 100 108 141 110 L 165 110 Q 206 108 216 116 L 220 140 Q 222 180 218 220 L 210 280 Q 200 290 153 292 Q 106 290 96 280 L 88 220 Q 84 180 86 140 Z"
          fill="url(#bodyGrad)"
        />

        {/* Left arm */}
        <path
          d="M 86 120 Q 68 124 58 150 L 48 200 Q 42 230 44 260 Q 44 275 50 280 Q 56 282 60 275 L 66 240 Q 70 220 72 200 L 78 170"
          stroke="url(#bodyGrad)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right arm */}
        <path
          d="M 220 120 Q 238 124 248 150 L 258 200 Q 264 230 262 260 Q 262 275 256 280 Q 250 282 246 275 L 240 240 Q 236 220 234 200 L 228 170"
          stroke="url(#bodyGrad)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Hips/waist */}
        <path
          d="M 96 280 Q 100 310 110 330 L 114 340 Q 130 345 153 346 Q 176 345 192 340 L 196 330 Q 206 310 210 280"
          fill="url(#bodyGrad)"
        />

        {/* Left leg */}
        <path
          d="M 114 340 Q 110 380 108 420 L 104 480 Q 102 510 100 540 Q 99 555 102 565 Q 108 572 90 575 Q 85 575 86 568 L 96 545 Q 98 520 100 500"
          stroke="url(#bodyGrad)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right leg */}
        <path
          d="M 192 340 Q 196 380 198 420 L 202 480 Q 204 510 206 540 Q 207 555 204 565 Q 198 572 216 575 Q 221 575 220 568 L 210 545 Q 208 520 206 500"
          stroke="url(#bodyGrad)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Scanning line that sweeps up and down */}
      <rect x="30" y="0" width="246" height="40" fill="url(#scanGrad)" opacity="0.5">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 560; 0 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Grid/wireframe overlay lines */}
      {[120, 200, 280, 360, 440].map((y) => (
        <line
          key={y}
          x1="60"
          y1={y}
          x2="246"
          y2={y}
          stroke="hsl(40, 65%, 55%)"
          strokeOpacity="0.06"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
      ))}
    </svg>
  );
}

export default function BiometricBody() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow behind body */}
      <div
        className="absolute w-[60%] h-[60%] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(40 65% 55% / 0.3), transparent 70%)" }}
      />

      {/* Body silhouette */}
      <div
        className="relative w-[280px] md:w-[320px] h-[500px] md:h-[560px] transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) rotateY(-12deg)" : "translateY(20px) rotateY(-12deg)",
          perspective: "800px",
        }}
      >
        <HumanSilhouette />
      </div>

      {/* Biometric data points */}
      {BIOMETRIC_DATA.map((item, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center transition-all duration-700"
          style={{
            left: item.x,
            top: item.y,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: `${item.delay + 0.5}s`,
          }}
        >
          {/* Connector dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-primary mb-1 animate-pulse" />
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
              {item.label}
            </p>
            <p className="text-sm font-bold text-foreground">
              {visible && <AnimatedValue target={item.value} />}
            </p>
          </div>
          {/* Dashed connector line */}
          <div className="w-px h-6 border-l border-dashed border-primary/30" />
        </div>
      ))}

      {/* Corner frame markers */}
      {[
        "top-[8%] left-[8%]",
        "top-[8%] right-[8%] rotate-90",
        "bottom-[8%] left-[8%] -rotate-90",
        "bottom-[8%] right-[8%] rotate-180",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos}`}>
          <div className="w-6 h-6 border-l-2 border-t-2 border-primary/30" />
        </div>
      ))}
    </div>
  );
}
