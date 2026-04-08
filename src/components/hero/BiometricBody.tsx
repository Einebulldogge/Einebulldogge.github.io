import { useEffect, useState } from "react";
import wireframeBody from "@/assets/wireframe-body.png";

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

      {/* Wireframe body image */}
      <div
        className="relative w-[340px] md:w-[450px] h-[600px] md:h-[800px] transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <img
          src={wireframeBody}
          alt="Biometric wireframe body"
          className="w-full h-full object-contain"
          width={812}
          height={1524}
        />
        {/* Scan line overlay */}
        <div
          className="absolute left-0 right-0 h-8 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(40 65% 55% / 0.2), transparent)",
            animation: "scanLine 4s ease-in-out infinite",
          }}
        />
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
          <div className="w-1.5 h-1.5 rounded-full bg-primary mb-1 animate-pulse" />
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-1.5 text-center whitespace-nowrap">
            <p className="text-[10px] uppercase tracking-wider text-primary font-medium">
              {item.label}
            </p>
            <p className="text-sm font-bold text-foreground">
              {visible && <AnimatedValue target={item.value} />}
            </p>
          </div>
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

      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2rem); }
        }
      `}</style>
    </div>
  );
}
