// src/components/studio/RecommendationPanel.tsx
// Drop-in replacement — no API key needed. Uses a hardcoded demo response.

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface RecommendationPanelProps {
  bodyGoals: Record<string, number>;
}

interface PathPreferences {
  diet: number;
  exercise: number;
  medical: number;
  supplements: number;
}

const pathColors: Record<string, string> = {
  diet: "bg-green-500",
  exercise: "bg-blue-500",
  medical: "bg-amber-500",
  supplements: "bg-pink-500",
};

const pathIcons: Record<string, string> = {
  diet: "🥗",
  exercise: "🏋️",
  medical: "⚕️",
  supplements: "💊",
};

// ─── Demo response ────────────────────────────────────────────────────────────
// This is what the AI would return for someone who wants to:
//   - Increase muscle tone & shoulder width significantly
//   - Decrease body fat & waist size
//   - Slight increase in chest & arm size
// Approach: 40% exercise, 35% diet, 15% supplements, 10% medical
const DEMO_RESULT = {
  summary:
    "Your plan focuses on building a lean, athletic physique — reducing body fat while adding visible muscle definition in your shoulders, chest, and arms. The heavy exercise emphasis means you'll train hard and eat precisely to fuel that work.",

  diet: `**Caloric target:** ~2,400 kcal/day (slight deficit to lose fat while preserving muscle)

**Macros:** 200g protein · 240g carbs · 65g fat

**What to eat:**
- **Breakfast:** 4 scrambled eggs + oats with blueberries + black coffee
- **Pre-workout:** Banana + 1 scoop whey protein in water
- **Lunch:** 200g grilled chicken breast, 1 cup brown rice, steamed broccoli with olive oil
- **Post-workout:** Greek yogurt (plain, full-fat) + 30g mixed nuts
- **Dinner:** 180g salmon or lean beef, roasted sweet potato, large leafy salad with lemon dressing

**Foods to cut:** Alcohol, fried foods, sugary drinks, ultra-processed snacks — these directly raise cortisol and stall fat loss.

**Meal timing:** Eat every 3–4 hours. Don't skip post-workout nutrition within 45 minutes of training.`,

  exercise: `**Weekly split (5 days):**

**Monday — Push (Chest/Shoulders/Triceps)**
- Barbell bench press: 4×6 @ 75% 1RM
- Overhead dumbbell press: 3×10
- Lateral raises: 4×15 (slow negatives)
- Cable flyes: 3×12
- Tricep rope pushdown: 3×15

**Tuesday — Pull (Back/Biceps)**
- Pull-ups (weighted if possible): 4×6
- Barbell row: 4×8
- Face pulls: 3×15 (critical for shoulder health)
- Hammer curls: 3×12 each arm

**Wednesday — Active recovery** (20-min walk + mobility)

**Thursday — Legs**
- Barbell squat: 4×6
- Romanian deadlift: 3×10
- Leg press: 3×12
- Calf raises: 4×20

**Friday — Shoulders & Arms (hypertrophy focus)**
- Arnold press: 4×10
- Rear delt flyes: 3×15
- Barbell curl: 4×10
- Overhead tricep extension: 3×12

**Cardio:** 20 min moderate-intensity (bike or incline walk) after each session to accelerate fat loss without muscle loss.`,

  medical: `**Bloodwork to request from your doctor before starting:**
- Testosterone (total + free) — low T significantly impairs muscle growth
- Thyroid panel (TSH, T3, T4) — thyroid dysfunction makes fat loss nearly impossible
- Vitamin D & B12 — deficiencies tank energy and recovery
- Complete metabolic panel — establishes your baseline

**Who to see:**
- **Sports medicine doctor or registered dietitian** — to confirm your caloric targets are right for your body
- **Physical therapist** (optional but recommended) — a movement screen can catch imbalances before they become injuries, especially shoulder impingement which is common when prioritizing shoulder/chest growth

**When to check in:** Retest bloodwork after 12 weeks to track hormonal response to training.`,

  supplements: `**Daily stack (in order of impact):**

1. **Creatine monohydrate** — 5g every morning with water. #1 evidence-backed supplement for strength and muscle volume. Takes ~2 weeks to saturate.

2. **Whey protein isolate** — 25–30g within 45 min post-workout. Use only if you're struggling to hit 200g protein from food alone.

3. **Vitamin D3 + K2** — 3,000 IU D3 + 100mcg K2 daily with a fatty meal. Most people are deficient; it affects testosterone and immune function.

4. **Magnesium glycinate** — 400mg before bed. Improves sleep quality and recovery, reduces muscle cramping.

5. **Caffeine (optional)** — 150–200mg 30 min before workouts for performance. Coffee works fine — no need for a pre-workout product.

**Skip:** Fat burners, testosterone boosters, BCAAs (redundant if protein is adequate). Save your money.`,

  timeline: `**Month 1:** Neural adaptation — strength increases rapidly even before visible muscle. Expect 2–4 lbs of fat loss if diet is consistent.

**Month 2–3:** Visible changes begin. Shoulders and arms respond fastest. Waist definition starts to emerge. Expect 1–1.5 lbs fat loss/week.

**Month 4–6:** The "click" phase — muscle definition becomes obvious, especially in shoulders and chest. Body fat visibly lower.

**Month 6+:** Major physique transformation visible. Most people hit their target look in 6–9 months with consistent adherence.`,

  disclaimer:
    "This plan is for informational purposes only. Consult a physician or certified healthcare professional before starting any new diet, exercise, or supplement regimen.",
};
// ─────────────────────────────────────────────────────────────────────────────

const RecommendationPanel = ({ bodyGoals }: RecommendationPanelProps) => {
  const [paths, setPaths] = useState<PathPreferences>({
    diet: 35,
    exercise: 40,
    medical: 10,
    supplements: 15,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);

  const handlePathChange = (key: keyof PathPreferences, value: number[]) => {
    const newVal = value[0];
    const oldVal = paths[key];
    const diff = newVal - oldVal;

    const otherKeys = (Object.keys(paths) as (keyof PathPreferences)[]).filter((k) => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + paths[k], 0);
    if (otherTotal === 0 && diff > 0) return;

    const newPaths = { ...paths, [key]: newVal };
    otherKeys.forEach((k) => {
      const proportion = otherTotal > 0 ? paths[k] / otherTotal : 1 / otherKeys.length;
      newPaths[k] = Math.max(0, Math.round(paths[k] - diff * proportion));
    });

    const total = Object.values(newPaths).reduce((s, v) => s + v, 0) as number;
    if (total !== 100) {
      const adjustKey = otherKeys.find((k) => newPaths[k] > 0) || otherKeys[0];
      newPaths[adjustKey] += 100 - total;
    }

    setPaths(newPaths);
  };

  const handleGenerate = () => {
    setLoading(true);
    setResult(null);
    // Simulate a 2-second "thinking" delay to make it feel real
    setTimeout(() => {
      setLoading(false);
      setResult(DEMO_RESULT);
    }, 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
          Path to Goal
        </h3>
      </div>

      {/* Path preference sliders */}
      <div className="space-y-2">
        {(Object.keys(paths) as (keyof PathPreferences)[]).map((key) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs font-body">
              <span className="text-foreground/80 flex items-center gap-1.5">
                <span>{pathIcons[key]}</span>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="text-muted-foreground tabular-nums">{paths[key]}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden flex-1">
                <div
                  className={`h-full rounded-full ${pathColors[key]} transition-all`}
                  style={{ width: `${paths[key]}%` }}
                />
              </div>
              <Slider
                value={[paths[key]]}
                onValueChange={(v) => handlePathChange(key, v)}
                max={100}
                min={0}
                step={5}
                className="cursor-pointer flex-1"
              />
            </div>
          </div>
        ))}
        <p className="text-[9px] text-muted-foreground/60 font-body text-center">
          Total always equals 100% — adjusting one redistributes the rest.
        </p>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        variant="hero"
        size="sm"
        className="w-full text-xs"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
            Analyzing your goals...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3 mr-1.5" />
            Get AI Recommendation
          </>
        )}
      </Button>

      {/* Results */}
      {result && (
        <div className="space-y-3 animate-fade-in">
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-xs font-body text-foreground font-medium">{result.summary}</p>
          </div>

          {result.timeline && (
            <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-[10px] text-muted-foreground font-body">⏱ </span>
              <span className="text-[10px] text-foreground font-body">{result.timeline}</span>
            </div>
          )}

          {result.diet && (
            <RecommendationSection icon="🥗" title="Diet" content={result.diet} color="border-green-500/30" />
          )}
          {result.exercise && (
            <RecommendationSection icon="🏋️" title="Exercise" content={result.exercise} color="border-blue-500/30" />
          )}
          {result.medical && (
            <RecommendationSection icon="⚕️" title="Medical" content={result.medical} color="border-amber-500/30" />
          )}
          {result.supplements && (
            <RecommendationSection icon="💊" title="Supplements" content={result.supplements} color="border-pink-500/30" />
          )}

          {result.disclaimer && (
            <p className="text-[9px] text-muted-foreground/60 font-body italic leading-relaxed">
              ⚠️ {result.disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const RecommendationSection = ({
  icon,
  title,
  content,
  color,
}: {
  icon: string;
  title: string;
  content: string;
  color: string;
}) => (
  <div className={`p-2.5 rounded-lg border ${color} bg-card/50 space-y-1`}>
    <h4 className="text-[10px] font-display font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
      <span>{icon}</span> {title}
    </h4>
    <div className="text-[11px] text-foreground/80 font-body leading-relaxed prose prose-xs max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);

export default RecommendationPanel;
