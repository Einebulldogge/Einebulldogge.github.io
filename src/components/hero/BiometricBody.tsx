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
      style={{ filter: "drop-shadow(0 0 40px hsl(40 65% 55% / 0.25))" }}
    >
      <defs>
        <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0" />
          <stop offset="45%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.3" />
          <stop offset="55%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="150" cy="280" rx="120" ry="250" fill="url(#glowGrad)" />

      <g transform="translate(150, 300) scale(0.92) skewY(-2) translate(-150, -300)">
        {/* Wireframe polygon mesh body */}
        {/* Head */}
        <polygon points="153,20 170,30 178,50 175,70 165,85 141,85 131,70 128,50 136,30" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.05" />
        <line x1="153" y1="20" x2="175" y2="70" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />
        <line x1="153" y1="20" x2="131" y2="70" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />
        <line x1="170" y1="30" x2="141" y2="85" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />
        <line x1="136" y1="30" x2="165" y2="85" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />
        <line x1="178" y1="50" x2="128" y2="50" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />

        {/* Neck */}
        <polygon points="141,85 165,85 162,108 144,108" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />
        <line x1="153" y1="85" x2="153" y2="108" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.3" />

        {/* Shoulders */}
        <polygon points="144,108 162,108 216,120 220,135 86,135 90,120" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.05" />
        <line x1="153" y1="108" x2="153" y2="135" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />
        <line x1="144" y1="108" x2="86" y2="135" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />
        <line x1="162" y1="108" x2="220" y2="135" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />

        {/* Upper torso */}
        <polygon points="86,135 220,135 218,190 88,190" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />
        <line x1="153" y1="135" x2="153" y2="190" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />
        <line x1="120" y1="135" x2="118" y2="190" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="186" y1="135" x2="188" y2="190" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="86" y1="160" x2="220" y2="160" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />

        {/* Mid torso */}
        <polygon points="88,190 218,190 212,250 94,250" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />
        <line x1="153" y1="190" x2="153" y2="250" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />
        <line x1="88" y1="220" x2="218" y2="220" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />

        {/* Lower torso / hips */}
        <polygon points="94,250 212,250 205,290 195,320 153,330 111,320 101,290" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.05" />
        <line x1="153" y1="250" x2="153" y2="330" stroke="hsl(40, 65%, 55%)" strokeWidth="0.4" opacity="0.2" />
        <line x1="94" y1="250" x2="195" y2="320" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.12" />
        <line x1="212" y1="250" x2="111" y2="320" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.12" />

        {/* Left arm */}
        <polygon points="86,135 90,120 72,135 60,165 50,200 44,240 48,270 56,278 62,265 66,240 72,200 78,170 86,150" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.03" />
        <line x1="86" y1="135" x2="50" y2="200" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.2" />
        <line x1="72" y1="135" x2="62" y2="265" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="60" y1="165" x2="78" y2="170" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        {/* Left hand */}
        <polygon points="48,270 56,278 52,288 44,292 40,285 42,275" stroke="hsl(40, 65%, 55%)" strokeWidth="0.6" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />

        {/* Right arm */}
        <polygon points="220,135 216,120 234,135 246,165 256,200 262,240 258,270 250,278 244,265 240,240 234,200 228,170 220,150" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.03" />
        <line x1="220" y1="135" x2="256" y2="200" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.2" />
        <line x1="234" y1="135" x2="244" y2="265" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="246" y1="165" x2="228" y2="170" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        {/* Right hand */}
        <polygon points="258,270 250,278 254,288 262,292 266,285 264,275" stroke="hsl(40, 65%, 55%)" strokeWidth="0.6" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />

        {/* Left leg */}
        <polygon points="111,320 153,330 140,380 130,430 124,480 118,530 112,555 104,565 92,570 88,562 98,545 106,510 110,460 116,400 118,360" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />
        <line x1="111" y1="320" x2="106" y2="510" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="140" y1="380" x2="98" y2="545" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.12" />
        <line x1="130" y1="430" x2="110" y2="460" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        {/* Left foot */}
        <polygon points="92,570 88,562 82,572 78,578 84,582 96,578" stroke="hsl(40, 65%, 55%)" strokeWidth="0.6" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />

        {/* Right leg */}
        <polygon points="195,320 153,330 166,380 176,430 182,480 188,530 194,555 202,565 214,570 218,562 208,545 200,510 196,460 190,400 188,360" stroke="hsl(40, 65%, 55%)" strokeWidth="0.8" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />
        <line x1="195" y1="320" x2="200" y2="510" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        <line x1="166" y1="380" x2="208" y2="545" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.12" />
        <line x1="176" y1="430" x2="196" y2="460" stroke="hsl(40, 65%, 55%)" strokeWidth="0.3" opacity="0.15" />
        {/* Right foot */}
        <polygon points="214,570 218,562 224,572 228,578 222,582 210,578" stroke="hsl(40, 65%, 55%)" strokeWidth="0.6" fill="hsl(40, 65%, 55%)" fillOpacity="0.04" />

        {/* Joint dots */}
        {[
          [153,20],[170,30],[136,30],[178,50],[128,50],[153,85],
          [90,120],[216,120],[86,135],[220,135],[153,135],
          [88,190],[218,190],[153,190],[94,250],[212,250],[153,250],
          [111,320],[195,320],[153,330],
          [60,165],[246,165],[50,200],[256,200],
          [48,270],[258,270],
          [130,430],[176,430],[118,530],[188,530],
          [92,570],[214,570],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="hsl(40, 65%, 55%)" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* Scanning line */}
      <rect x="30" y="0" width="246" height="30" fill="url(#scanGrad)" opacity="0.5">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 570; 0 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>

      {/* "ANATOMY" label like reference */}
      <text x="150" y="598" textAnchor="middle" fill="hsl(40, 65%, 55%)" fontSize="8" fontFamily="monospace" letterSpacing="4" opacity="0.4">
        ANATOMY
      </text>
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
