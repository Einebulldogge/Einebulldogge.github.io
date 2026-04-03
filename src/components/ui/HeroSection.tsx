import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const METRICS = [
  "Body Fat %", "Lean Muscle Mass", "Metabolic Rate", "VO₂ Max",
  "Shoulder Width", "Waist Circumference", "HRV", "Protein Intake",
  "Recovery Rate", "Hydration Level", "Sleep Quality", "Cortisol Level",
  "Bone Density", "Visceral Fat", "Blood Glucose"
];

// --- Types ---
interface Card {
  text: string;
  y: number;
  targetY: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
  color: string;
  targetX: number;
  targetY: number;
  arrived: boolean;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    let rafId: number;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    // --- Generate Text Target Points ---
    function getTextOutlinePoints(text: string, width: number, height: number) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
      if (!tCtx) return [];

      tCtx.font = "italic 800 140px 'DM Sans', sans-serif";
      tCtx.textAlign = "center";
      tCtx.textBaseline = "middle";
      tCtx.lineWidth = 4; // Slightly thinner stroke for a cleaner base
      tCtx.strokeStyle = "white";
      tCtx.strokeText(text, width * 0.78, height * 0.45);

      const imgData = tCtx.getImageData(0, 0, width, height).data;
      const points: { x: number; y: number }[] = [];
      
      // REFINED DENSITY: Increased step to 2.5 to reduce overlapping lines
      for (let y = 0; y < height; y += 2.5) {
        for (let x = 0; x < width; x += 2.5) {
          const alpha = imgData[(y * width + x) * 4 + 3];
          if (alpha > 50) { // Higher threshold for cleaner edges
            points.push({ x, y });
          }
        }
      }
      return points;
    }

    let phase: "stacking" | "flow" | "frozen" = "stacking";
    
    const CARD_W = 260;
    const CARD_H = 55;
    const CARD_GAP = 12;
    let cards: Card[] = [];
    let metricIndex = 0;
    let lastCardTime = 0;
    const CARD_SPAWN_RATE = 750; 
    
    let particles: Particle[] = [];
    let flowTimer = 0;

    const getRightX = () => W * 0.78;

    function loop(timestamp: number) {
      if (phase === "stacking") {
        ctx.clearRect(0, 0, W, H);
        
        if (timestamp - lastCardTime > CARD_SPAWN_RATE && metricIndex < METRICS.length) {
          cards.push({
            text: METRICS[metricIndex],
            y: H + 100, 
            targetY: 0, 
            alpha: 0
          });
          metricIndex++;
          lastCardTime = timestamp;
        }

        const stackBottomY = H * 0.85; 
        const totalStackHeight = cards.length * (CARD_H + CARD_GAP);
        
        for (let i = 0; i < cards.length; i++) {
          const reverseIndex = cards.length - 1 - i; 
          cards[i].targetY = stackBottomY - (reverseIndex * (CARD_H + CARD_GAP));
          
          cards[i].y += (cards[i].targetY - cards[i].y) * 0.1;
          cards[i].alpha += (1 - cards[i].alpha) * 0.08;

          const cx = getRightX() - CARD_W / 2;
          const cy = cards[i].y - CARD_H / 2;
          
          ctx.save();
          ctx.globalAlpha = cards[i].alpha;
          ctx.fillStyle = "rgba(17, 20, 29, 0.95)";
          ctx.beginPath();
          ctx.roundRect(cx, cy, CARD_W, CARD_H, 12);
          ctx.fill();
          ctx.strokeStyle = "rgba(245, 158, 11, 0.25)"; 
          ctx.lineWidth = 1; 
          ctx.stroke();
          ctx.font = "600 14px 'DM Sans', sans-serif"; 
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; 
          ctx.fillText(cards[i].text, cx + 20, cy + 32);
          ctx.beginPath(); 
          ctx.arc(cx + CARD_W - 24, cy + 27, 4, 0, Math.PI * 2); 
          ctx.fillStyle = "rgba(245, 158, 11, 1)"; 
          ctx.fill();
          ctx.restore();
        }

        if (totalStackHeight > H * 0.72) {
          phase = "flow";
          flowTimer = timestamp;
          const targetPoints = getTextOutlinePoints("Taylour", W, H);
          
          for (let i = targetPoints.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [targetPoints[i], targetPoints[j]] = [targetPoints[j], targetPoints[i]];
          }

          targetPoints.forEach((point, idx) => {
            const originCard = cards[idx % cards.length];
            const cx = getRightX() - CARD_W / 2;
            const cy = originCard.y - CARD_H / 2;

            particles.push({
              x: cx + Math.random() * CARD_W,
              y: cy + Math.random() * CARD_H,
              vx: (Math.random() - 0.5) * 8, 
              vy: (Math.random() - 0.5) * 8,
              speed: 1.2 + Math.random() * 2,
              size: Math.random() * 1.0 + 0.6,
              // SUBTLETY: Slightly reduced alpha for the flow trails
              color: Math.random() > 0.5 ? "rgba(245, 158, 11, 0.08)" : "rgba(253, 230, 138, 0.06)",
              targetX: point.x,
              targetY: point.y,
              arrived: false
            });
          });
          ctx.clearRect(0, 0, W, H);
        }

      } else if (phase === "flow" || phase === "frozen") {
        const timeInFlow = timestamp - flowTimer;
        let stillMoving = false;

        for (const p of particles) {
          if (!p.arrived) {
            stillMoving = true;
            const dxTarget = p.targetX - p.x;
            const dyTarget = p.targetY - p.y;
            const distTarget = Math.hypot(dxTarget, dyTarget);

            if (distTarget < 1.2) {
              p.arrived = true;
              continue;
            }

            const angle = Math.sin(p.x * 0.002) * Math.cos(p.y * 0.002) * Math.PI * 2;
            p.vx += Math.cos(angle) * 0.15;
            p.vy += Math.sin(angle) * 0.15;

            const pullStrength = Math.min(0.08, timeInFlow / 20000); 
            p.vx += (dxTarget / distTarget) * p.speed * pullStrength;
            p.vy += (dyTarget / distTarget) * p.speed * pullStrength;

            const textCenterX = W * 0.25; 
            const textCenterY = H * 0.5; 
            const dxRepel = p.x - textCenterX;
            const dyRepel = p.y - textCenterY;
            const distRepel = Math.hypot(dxRepel, dyRepel * 1.2); 
            const repelRadius = W * 0.45; 

            if (distRepel < repelRadius) {
              const force = (repelRadius - distRepel) / repelRadius;
              p.vx += (dxRepel / distRepel) * force * 0.6; 
              p.vy += (dyRepel / distRepel) * force * 0.6;
            }

            const currentSpeed = Math.hypot(p.vx, p.vy);
            if (currentSpeed > p.speed) {
              p.vx = (p.vx / currentSpeed) * p.speed;
              p.vy = (p.vy / currentSpeed) * p.speed;
            }

            if (timeInFlow > 4000) {
                p.vx *= 0.96;
                p.vy *= 0.96;
            }

            const oldX = p.x;
            const oldY = p.y;
            p.x += p.vx;
            p.y += p.vy;

            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.stroke();
          } else {
            // Static wordmark rendering
            ctx.fillStyle = "rgba(245, 158, 11, 0.45)";
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }

        if (!stillMoving && phase === "flow") {
          phase = "frozen"; 
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-[#0A0D14] font-body">
      
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-[#0A0D14]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      <div className="container relative mx-auto px-6 z-20 flex">
        <div className="w-full md:w-[45%] space-y-8 mt-16 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="inline-flex gap-1">
              {[0.35, 0.6, 1].map((o, i) => (
                <span key={i} className="block w-1.5 h-1.5 rounded-full bg-amber-500" style={{ opacity: o }} />
              ))}
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-medium">Biometric Transformation Engine</p>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-white">
            Look the way <br/>
            <span className="text-amber-500 italic">you</span> want to.
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed max-w-md">
            Taylour maps your body goals to a precise, personalised plan — combining AI‑powered insights across diet, training, and longevity protocols.
          </p>

          <div className="flex gap-4 pt-4">
            <Button className="bg-amber-500 text-black hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2)] px-8 py-6 text-sm uppercase tracking-widest font-bold" asChild>
              <Link to="/studio">Start Your Journey</Link>
            </Button>
            <Button variant="outline" className="border-gray-800 text-white hover:border-amber-500/50 px-8 py-6 text-sm uppercase tracking-widest" asChild>
              <Link to="/store">Explore Apothecary</Link>
            </Button>
          </div>
        </div>
      </div>
      
    </section>
  );
}