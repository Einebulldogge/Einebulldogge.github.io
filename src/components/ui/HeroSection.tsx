import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
 
// ─── Biometric insight pool ───────────────────────────────────────────────────
// Large rotating pool — nodes cycle through these forever, picking a new one
// each time a slot "expires". Categories keep it feeling varied and real.
 
const INSIGHT_POOL = [
  // Body composition
  { label: "Body Fat",         value: "18.4%",      category: "composition" },
  { label: "Body Fat",         value: "↓ 2.1%",     category: "composition" },
  { label: "Lean Mass",        value: "72.3 kg",     category: "composition" },
  { label: "Lean Mass",        value: "↑ 1.8 kg",   category: "composition" },
  { label: "Visceral Fat",     value: "Level 6",     category: "composition" },
  { label: "Visceral Fat",     value: "↓ 2 levels",  category: "composition" },
  { label: "Bone Density",     value: "1.24 g/cm²",  category: "composition" },
  { label: "Water %",          value: "58.2%",       category: "composition" },
  { label: "Muscle Mass",      value: "↑ 12%",       category: "composition" },
  { label: "Muscle Symmetry",  value: "94% balance", category: "composition" },
 
  // Metabolic
  { label: "Metabolic Rate",   value: "2,340 kcal",  category: "metabolic" },
  { label: "Metabolic Rate",   value: "↑ 180 kcal",  category: "metabolic" },
  { label: "Caloric Deficit",  value: "−420 kcal",   category: "metabolic" },
  { label: "Caloric Surplus",  value: "+250 kcal",   category: "metabolic" },
  { label: "Fat Burn Zone",    value: "128–144 bpm", category: "metabolic" },
  { label: "Glucose",          value: "94 mg/dL",    category: "metabolic" },
  { label: "Insulin Sens.",    value: "High",         category: "metabolic" },
  { label: "Ketone Level",     value: "0.8 mmol/L",  category: "metabolic" },
  { label: "Carb Tolerance",   value: "Moderate",    category: "metabolic" },
  { label: "Protein Synthesis","value": "Elevated",  category: "metabolic" },
 
  // Performance
  { label: "VO₂ Max",          value: "48.2 mL/kg",  category: "performance" },
  { label: "VO₂ Max",          value: "↑ 3.4 pts",   category: "performance" },
  { label: "1RM Bench",        value: "102 kg",       category: "performance" },
  { label: "1RM Squat",        value: "138 kg",       category: "performance" },
  { label: "Sprint Speed",     value: "28.4 km/h",   category: "performance" },
  { label: "Pull-up Max",      value: "14 reps",      category: "performance" },
  { label: "Grip Strength",    value: "52 kg",        category: "performance" },
  { label: "Endurance Score",  value: "81 / 100",    category: "performance" },
  { label: "Power Output",     value: "320 W",        category: "performance" },
  { label: "Lactate Thresh.",  value: "162 bpm",      category: "performance" },
 
  // Recovery & wellness
  { label: "Recovery",         value: "94%",          category: "recovery" },
  { label: "Recovery",         value: "↑ 8%",         category: "recovery" },
  { label: "Sleep Quality",    value: "Deep: 1h 42m", category: "recovery" },
  { label: "HRV",              value: "68 ms",        category: "recovery" },
  { label: "HRV",              value: "↑ 12 ms",      category: "recovery" },
  { label: "Resting HR",       value: "54 bpm",       category: "recovery" },
  { label: "Cortisol",         value: "Normal",       category: "recovery" },
  { label: "Inflammation",     value: "Low",          category: "recovery" },
  { label: "Muscle Soreness",  value: "2 / 10",       category: "recovery" },
  { label: "Readiness",        value: "High",         category: "recovery" },
 
  // Goals & timeline
  { label: "Goal Timeline",    value: "16 weeks",     category: "goal" },
  { label: "Progress",         value: "38% complete", category: "goal" },
  { label: "Week Streak",      value: "7 weeks",      category: "goal" },
  { label: "Adherence",        value: "91%",          category: "goal" },
  { label: "Plan Accuracy",    value: "98%",          category: "goal" },
  { label: "Projected Result", value: "−8.2 kg fat",  category: "goal" },
  { label: "Projected Result", value: "+4.1 kg LBM",  category: "goal" },
  { label: "Check-in Due",     value: "In 3 days",    category: "goal" },
 
  // Nutrition
  { label: "Protein Intake",   value: "198 g / day",  category: "nutrition" },
  { label: "Hydration",        value: "Optimal",      category: "nutrition" },
  { label: "Hydration",        value: "2.8 L today",  category: "nutrition" },
  { label: "Omega-3 Index",    value: "8.2%",         category: "nutrition" },
  { label: "Vitamin D",        value: "42 ng/mL",     category: "nutrition" },
  { label: "Creatine Load",    value: "Saturated",    category: "nutrition" },
  { label: "Calorie Timing",   value: "On target",    category: "nutrition" },
  { label: "Macro Split",      value: "40 / 35 / 25", category: "nutrition" },
 
  // Structural / body shape
  { label: "Waist",            value: "81.4 cm",      category: "shape" },
  { label: "Waist",            value: "↓ 3.2 cm",     category: "shape" },
  { label: "Shoulder Width",   value: "↑ 1.4 cm",     category: "shape" },
  { label: "Hip-to-Waist",     value: "0.82 ratio",   category: "shape" },
  { label: "V-Taper Score",    value: "74 / 100",     category: "shape" },
  { label: "Chest",            value: "102 cm",       category: "shape" },
  { label: "Arm Girth",        value: "37.8 cm",      category: "shape" },
  { label: "Posture Score",    value: "Good",         category: "shape" },
];
 
// Fixed slot positions (fractional x, y) — 6 slots on screen at any time
const SLOTS = [
  { fx: 0.72, fy: 0.20 },
  { fx: 0.84, fy: 0.44 },
  { fx: 0.63, fy: 0.63 },
  { fx: 0.79, fy: 0.79 },
  { fx: 0.55, fy: 0.36 },
  { fx: 0.91, fy: 0.60 },
];
 
// How long each node stays visible before cycling to a new insight (ms)
const NODE_LIFETIME = 3200;
// Stagger between initial appearances (ms)
const REVEAL_STAGGER = 480;
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
interface FlowLine {
  cps: [number, number][];
  progress: number;
  speed: number;
  alpha: number;
  width: number;
  glow: number;
  trail: number;
}
 
interface ActiveNode {
  slotIdx: number;
  insightIdx: number;
  phase: number;          // pulse phase offset
  born: number;           // timestamp when this node became visible
  fadeIn: number;         // fade-in duration ms
  fadeOut: number;        // fade-out duration ms
}
 
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}
 
// ─── Bezier helpers ───────────────────────────────────────────────────────────
 
function cubicPoint(
  p0: [number,number], p1: [number,number],
  p2: [number,number], p3: [number,number], t: number
): [number, number] {
  const mt = 1 - t;
  return [
    mt*mt*mt*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t*t*t*p3[0],
    mt*mt*mt*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t*t*t*p3[1],
  ];
}
 
function buildCurve(cps: [number,number][], steps = 140): [number,number][] {
  const pts: [number,number][] = [];
  for (let i = 0; i <= steps; i++) pts.push(cubicPoint(cps[0], cps[1], cps[2], cps[3], i / steps));
  return pts;
}
 
// Pick a random insight index that isn't already on screen
function pickInsight(exclude: number[]): number {
  const pool = Array.from({ length: INSIGHT_POOL.length }, (_, i) => i).filter(i => !exclude.includes(i));
  return pool[Math.floor(Math.random() * pool.length)];
}
 
// ─── Canvas init ──────────────────────────────────────────────────────────────
 
function initCanvas(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  let raf = 0;
 
  const GOLD   = "194,147,76";
  const GOLD_L = "220,175,100";
  const CREAM  = "235,218,190";
 
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
 
  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;
 
  // ── Flow lines ──────────────────────────────────────────────────────────
  const lineTemplates: Omit<FlowLine, "progress">[] = [
    { cps: [[0.0,0.80],[0.30,0.30],[0.60,0.55],[1.0,0.20]], speed:0.0014, alpha:0.90, width:2.2, glow:18, trail:0.55 },
    { cps: [[0.0,0.55],[0.25,0.75],[0.55,0.40],[1.0,0.65]], speed:0.0011, alpha:0.55, width:1.4, glow:12, trail:0.45 },
    { cps: [[0.10,0.0],[0.35,0.45],[0.62,0.25],[0.95,0.50]], speed:0.0009, alpha:0.40, width:1.0, glow: 9, trail:0.40 },
    { cps: [[0.0,0.95],[0.40,0.60],[0.65,0.80],[1.0,0.45]], speed:0.0012, alpha:0.35, width:0.9, glow: 7, trail:0.38 },
    { cps: [[0.05,0.35],[0.30,0.20],[0.58,0.70],[1.0,0.30]], speed:0.0008, alpha:0.25, width:0.7, glow: 5, trail:0.35 },
    { cps: [[0.0,0.65],[0.50,0.15],[0.70,0.60],[1.0,0.80]], speed:0.0007, alpha:0.18, width:0.6, glow: 4, trail:0.30 },
  ];
 
  const lines: FlowLine[] = lineTemplates.map((l, i) => ({ ...l, progress: -(i * 0.20) }));
  let curves: [number,number][][] = lines.map(l => buildCurve(l.cps));
  window.addEventListener("resize", () => { curves = lines.map(l => buildCurve(l.cps)); });
 
  // ── Active nodes ────────────────────────────────────────────────────────
  // Null = slot not yet revealed or between cycles
  const activeNodes: (ActiveNode | null)[] = Array(SLOTS.length).fill(null);
  let startTime = 0; // set on first frame
 
  function spawnNode(slotIdx: number, ts: number) {
    const exclude = activeNodes.filter(Boolean).map(n => n!.insightIdx);
    const insightIdx = pickInsight(exclude);
    activeNodes[slotIdx] = {
      slotIdx,
      insightIdx,
      phase: Math.random() * Math.PI * 2,
      born: ts,
      fadeIn: 400,
      fadeOut: 600,
    };
    const slot = SLOTS[slotIdx];
    spawnParticle(slot.fx * W(), slot.fy * H(), 5);
  }
 
  // ── Particles ───────────────────────────────────────────────────────────
  let particles: Particle[] = [];
 
  function spawnParticle(x: number, y: number, burst = 4) {
    for (let i = 0; i < burst; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = 0.3 + Math.random() * 1.0;
      particles.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: 0, maxLife: 50 + Math.random()*50, size: 0.8 + Math.random()*1.8 });
    }
  }
 
  // ── Draw helpers ────────────────────────────────────────────────────────
 
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = `rgba(${GOLD},0.04)`;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W(); x += 55) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H()); ctx.stroke(); }
    for (let y = 0; y < H(); y += 55) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W(),y); ctx.stroke(); }
    ctx.restore();
  }
 
  function drawLine(line: FlowLine, pts: [number,number][]) {
    const p = Math.min(Math.max(line.progress, 0), 1);
    if (p <= 0) return;
    const total   = pts.length - 1;
    const tipIdx  = Math.floor(p * total);
    const tailIdx = Math.max(0, Math.floor((p - line.trail) * total));
    if (tipIdx < 1) return;
 
    const tipX  = pts[tipIdx][0]  * W(), tipY  = pts[tipIdx][1]  * H();
    const tailX = pts[tailIdx][0] * W(), tailY = pts[tailIdx][1] * H();
 
    const grad = ctx.createLinearGradient(tailX, tailY, tipX, tipY);
    grad.addColorStop(0,   `rgba(${GOLD},0)`);
    grad.addColorStop(0.6, `rgba(${GOLD},${line.alpha * 0.6})`);
    grad.addColorStop(1,   `rgba(${GOLD_L},${line.alpha})`);
 
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[tailIdx][0]*W(), pts[tailIdx][1]*H());
    for (let i = tailIdx+1; i <= tipIdx; i++) ctx.lineTo(pts[i][0]*W(), pts[i][1]*H());
    ctx.strokeStyle = `rgba(${GOLD},${line.alpha*0.25})`;
    ctx.lineWidth = line.width + line.glow;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.filter = `blur(${line.glow*0.7}px)`;
    ctx.stroke();
    ctx.restore();
 
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[tailIdx][0]*W(), pts[tailIdx][1]*H());
    for (let i = tailIdx+1; i <= tipIdx; i++) ctx.lineTo(pts[i][0]*W(), pts[i][1]*H());
    ctx.strokeStyle = grad;
    ctx.lineWidth = line.width;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
 
    if (p < 0.99) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(tipX, tipY, line.width * 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${GOLD_L},${line.alpha})`;
      ctx.shadowColor = `rgba(${GOLD_L},1)`; ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();
    }
  }
 
  function drawNode(node: ActiveNode, ts: number) {
    const slot    = SLOTS[node.slotIdx];
    const insight = INSIGHT_POOL[node.insightIdx];
    const nx      = slot.fx * W();
    const ny      = slot.fy * H();
    const elapsed = ts - node.born;
    const pulse   = (Math.sin(ts * 0.0018 + node.phase) + 1) / 2;
 
    // Compute opacity for fade-in / fade-out
    let opacity = 1;
    if (elapsed < node.fadeIn) {
      opacity = elapsed / node.fadeIn;
    } else if (elapsed > NODE_LIFETIME - node.fadeOut) {
      opacity = Math.max(0, (NODE_LIFETIME - elapsed) / node.fadeOut);
    }
    if (opacity <= 0) return;
 
    const o = opacity; // shorthand
 
    // Outer pulse ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(nx, ny, 20 + pulse * 10, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(${GOLD},${(0.12 + pulse*0.13) * o})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
 
    // Middle ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(nx, ny, 11, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(${GOLD},${(0.55 + pulse*0.3) * o})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = `rgba(${GOLD},${0.9 * o})`; ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
 
    // Core dot
    ctx.save();
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${GOLD_L},${(0.85 + pulse*0.15) * o})`;
    ctx.shadowColor = `rgba(${GOLD_L},${o})`; ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();
 
    // Label card
    const cardW = 124, cardH = 40;
    const cx = nx + 18, cy = ny - cardH / 2;
 
    // Connector tick
    ctx.save();
    ctx.beginPath(); ctx.moveTo(nx + 5, ny); ctx.lineTo(cx, ny);
    ctx.strokeStyle = `rgba(${GOLD},${0.35 * o})`; ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
 
    // Card bg
    ctx.save();
    ctx.fillStyle   = `rgba(12,17,26,${0.88 * o})`;
    ctx.strokeStyle = `rgba(${GOLD},${0.38 * o})`;
    ctx.lineWidth   = 1;
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(cx+r, cy);
    ctx.lineTo(cx+cardW-r, cy); ctx.quadraticCurveTo(cx+cardW, cy,       cx+cardW, cy+r);
    ctx.lineTo(cx+cardW, cy+cardH-r); ctx.quadraticCurveTo(cx+cardW, cy+cardH, cx+cardW-r, cy+cardH);
    ctx.lineTo(cx+r, cy+cardH); ctx.quadraticCurveTo(cx, cy+cardH,       cx, cy+cardH-r);
    ctx.lineTo(cx, cy+r); ctx.quadraticCurveTo(cx, cy,             cx+r, cy);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
 
    // Top accent bar
    ctx.save();
    ctx.fillStyle = `rgba(${GOLD},${0.55 * o})`;
    ctx.beginPath(); ctx.roundRect(cx, cy, cardW, 2, [6,6,0,0]); ctx.fill();
    ctx.restore();
 
    // Category dot
    const catColors: Record<string, string> = {
      composition: "100,200,120",
      metabolic:   "100,160,240",
      performance: "240,140,80",
      recovery:    "180,120,240",
      goal:        `${GOLD}`,
      nutrition:   "80,200,180",
      shape:       "240,100,140",
    };
    const dotColor = catColors[insight.category] || GOLD;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx + cardW - 10, cy + 10, 3, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${dotColor},${0.8 * o})`; ctx.fill();
    ctx.restore();
 
    // Text
    ctx.save();
    ctx.font      = "500 8.5px 'DM Sans', sans-serif";
    ctx.fillStyle = `rgba(${GOLD},${0.65 * o})`;
    ctx.fillText(insight.label.toUpperCase(), cx + 9, cy + 15);
    ctx.font      = "600 14px 'DM Sans', sans-serif";
    ctx.fillStyle = `rgba(${CREAM},${0.96 * o})`;
    ctx.fillText(insight.value, cx + 9, cy + 31);
    ctx.restore();
  }
 
  function drawParticles() {
    particles = particles.filter(p => p.life < p.maxLife);
    for (const p of particles) {
      const a = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${GOLD},${a * 0.65})`; ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.life++;
    }
  }
 
  // ── Main loop ───────────────────────────────────────────────────────────
  function loop(ts: number) {
    raf = requestAnimationFrame(loop);
    if (startTime === 0) startTime = ts;
    const elapsed = ts - startTime;
 
    ctx.clearRect(0, 0, W(), H());
    drawGrid();
 
    // Lines
    for (let i = 0; i < lines.length; i++) {
      lines[i].progress += lines[i].speed;
      if (lines[i].progress > 1.15) lines[i].progress = -(lines[i].trail + 0.05);
      drawLine(lines[i], curves[i]);
    }
 
    // Node slot management
    for (let i = 0; i < SLOTS.length; i++) {
      const slotRevealTime = i * REVEAL_STAGGER;
      if (elapsed < slotRevealTime) continue; // not yet revealed
 
      const node = activeNodes[i];
      if (!node) {
        // Slot is empty — spawn immediately
        spawnNode(i, ts);
      } else {
        const age = ts - node.born;
        if (age >= NODE_LIFETIME) {
          // Expired — replace with a new insight
          activeNodes[i] = null;
          spawnNode(i, ts);
        }
      }
    }
 
    // Random ambient particles from active slots
    if (Math.random() < 0.05) {
      const live = activeNodes.filter(Boolean) as ActiveNode[];
      if (live.length) {
        const n = live[Math.floor(Math.random() * live.length)];
        const slot = SLOTS[n.slotIdx];
        spawnParticle(slot.fx * W(), slot.fy * H(), 1);
      }
    }
 
    drawParticles();
    for (const node of activeNodes) {
      if (node) drawNode(node, ts);
    }
  }
 
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
 
// ─── Component ────────────────────────────────────────────────────────────────
 
const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initCanvas(canvas);
  }, []);
 
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
 
      {/* Static hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ opacity: 0.28 }}
          width={1280}
          height={720}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/55" />
      </div>
 
      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "screen", opacity: 0.88 }}
      />
 
      {/* Readability gradient over canvas */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent pointer-events-none" />
 
      {/* Soft bloom behind copy */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 10% 50%, hsl(40 65% 55% / 0.06) 0%, transparent 68%)" }}
      />
 
      {/* Copy */}
      <div className="container relative mx-auto px-6 z-10">
        <div className="max-w-xl space-y-8">
 
          <div className="flex items-center gap-3">
            <span className="inline-flex gap-1">
              {[0.35, 0.6, 1].map((o, i) => (
                <span key={i} className="block w-1.5 h-1.5 rounded-full bg-primary" style={{ opacity: o }} />
              ))}
            </span>
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-body font-medium">
              Biometric Transformation Engine
            </p>
          </div>
 
          <h1 className="font-display text-5xl md:text-[4.25rem] font-bold leading-[1.07] text-foreground">
            Look the way{" "}
            <span className="text-gradient-gold italic">you</span>
            <br />want to
          </h1>
 
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-body">
            Taylour maps your body goals to a precise, personalised plan —
            combining AI‑powered insights across diet, training, and medical guidance.
          </p>
 
          <div className="flex gap-7 pt-1">
            {[
              { v: "24+",    l: "Body metrics" },
              { v: "98%",    l: "Plan accuracy" },
              { v: "12 wks", l: "Avg. timeline" },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold text-gradient-gold leading-none">{v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body mt-1">{l}</p>
              </div>
            ))}
          </div>
 
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="hero" size="lg" className="text-base px-10" asChild>
              <Link to="/studio">Start Your Journey</Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-10" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
 
          <p className="text-[11px] text-muted-foreground/35 font-body">
            No account required · Your data stays on your device
          </p>
        </div>
      </div>
 
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
 
export default HeroSection;