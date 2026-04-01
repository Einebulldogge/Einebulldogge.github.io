// src/components/studio/RecommendationPanel.tsx
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Download, RefreshCcw } from "lucide-react";
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

// ─── Premium Clinical Demo Response ────────────────────────────────────────────
const DEMO_RESULT = {
  summary:
    "Protocol Alpha: Your plan focuses on optimizing biomarkers and achieving metabolic flexibility. Based on your inputs, we are prioritizing hyper-targeted hypertrophy paired with a strict 16:8 nutritional window to accelerate body recomposition.",

  diet: `**Caloric target:** ~2,400 kcal/day (Controlled deficit for lipolysis while preventing sarcopenia)
**Macros:** 200g protein · 240g carbs · 65g fat

**Protocol Directives:**
* **Protein Threshold:** Target 1.8g/kg of lean body mass.
* **Fasting Window:** Implement a 16:8 Time-Restricted Feeding schedule.
* **Micronutrients:** Increase intake of sulforaphane (cruciferous vegetables) for Nrf2 activation and cellular defense.
* **Restriction:** Complete cessation of ultra-processed seed oils and refined fructose to minimize systemic inflammation.`,

  exercise: `**Weekly Split (Optimization Focus):**

* **Zone 2 Stability (Cardio):** 150 minutes per week at Heart Rate Zone 2 to increase mitochondrial density.
* **V02 Max Loading:** 1 session of 4x4 Norwegian intervals per week to expand cardiovascular capacity.
* **Hypertrophy (Resistance):** 3 sessions of heavy compound movements. Focus on progressive overload in the 5-8 rep range.
* **Neurological Recovery:** 1 day dedicated to active mobility and CNS (Central Nervous System) recovery.`,

  medical: `**Baseline Blood Panel Requirements:**
To ensure protocol efficacy, request the following from your physician:
* **ApoB & Lp(a):** Critical markers for cardiovascular risk assessment.
* **HbA1c & Fasting Insulin:** To measure baseline metabolic flexibility.
* **Free Testosterone & Thyroid Cascade (TSH, free T3/T4):** To rule out endocrine bottlenecks stalling your fat loss.

**Next Check-in:** Retest biomarkers in exactly 12 weeks to quantify the protocol's systemic impact.`,

  supplements: `**Daily Baseline Stack:**

1.  **AM:** Vitamin D3 (5000 IU) + Vitamin K2 (100mcg) with a fat source to optimize absorption.
2.  **AM:** Creatine Monohydrate (5g). #1 evidence-backed supplement for intracellular hydration and ATP production.
3.  **PM:** Magnesium Glycinate or Threonate (400mg) 60 minutes before bed to enhance sleep architecture.
4.  **PM (Optional):** Apigenin (50mg) to further down-regulate the nervous system pre-sleep.

*Skip redundant BCAAs and thermogenic fat burners. Capital allocation is better spent on whole foods.*`,

  timeline: `**Phase 1 (Weeks 1-4):** Neurological adaptation and insulin sensitivity baseline correction.
**Phase 2 (Weeks 5-8):** Visible lipolysis (fat loss) and increased mitochondrial capacity.
**Phase 3 (Weeks 9-12):** Major physique transformation visible. Biomarkers ready for re-testing.`,

  disclaimer:
    "This algorithmic protocol is for informational purposes only. Consult a clinical physician before beginning any advanced nutritional or physical regimen.",
};
// ─────────────────────────────────────────────────────────────────────────────

export function RecommendationPanel({ bodyGoals }: RecommendationPanelProps) {
  const [paths, setPaths] = useState<PathPreferences>({
    diet: 35,
    exercise: 40,
    medical: 10,
    supplements: 15,
  });

  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);

  const loadingMessages = [
    "Analyzing biometrics...",
    "Cross-referencing longevity markers...",
    "Optimizing macros & workout split...",
    "Finalizing personalized protocol...",
  ];

  // Cycling text effect for the loading state
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

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
    setLoadingPhase(0);
    setResult(null);
    
    // Simulate a 2.5-second deep "thinking" delay
    setTimeout(() => {
      setLoading(false);
      setResult(DEMO_RESULT);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Path Customization
        </h3>
      </div>

      {/* Path preference sliders (Kept exactly as you built them) */}
      <div className="space-y-2 p-4 border rounded-lg bg-card shadow-sm">
        {(Object.keys(paths) as (keyof PathPreferences)[]).map((key) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs font-body">
              <span className="text-foreground/80 flex items-center gap-1.5">
                <span>{pathIcons[key]}</span>
                <span className="capitalize font-medium">{key}</span>
              </span>
              <span className="text-muted-foreground tabular-nums font-medium">{paths[key]}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 rounded-full bg-muted overflow-hidden flex-1 shadow-inner">
                <div
                  className={`h-full rounded-full ${pathColors[key]} transition-all duration-300`}
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
        <p className="text-[10px] text-muted-foreground/60 font-body text-center pt-2">
          Total always equals 100% — adjusting one redistributes the rest.
        </p>
      </div>

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-6 transition-all hover:scale-[1.01] shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary-foreground" />
            <span className="animate-pulse">{loadingMessages[loadingPhase]}</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Longevity Protocol
          </>
        )}
      </Button>

      {/* Premium Results Wrapper */}
      {loading && !result && (
        <div className="mt-6 p-8 rounded-xl border border-primary/20 bg-gradient-to-b from-card to-secondary/10 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95">
           <div className="relative">
             <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
             <Sparkles className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
           </div>
           <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center">
             Synthesizing Data
           </p>
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 overflow-hidden rounded-xl border bg-gradient-to-b from-card to-secondary/10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Ribbon */}
          <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Biometric Analysis Result</span>
            <span className="text-[10px] text-muted-foreground">Generated {new Date().toLocaleDateString()}</span>
          </div>

          <div className="p-4 space-y-4">
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 shadow-inner">
              <p className="text-xs font-body text-foreground font-medium leading-relaxed">{result.summary}</p>
            </div>

            {result.timeline && (
              <div className="p-2.5 rounded-lg bg-background border shadow-sm">
                <span className="text-[10px] text-muted-foreground font-body uppercase font-bold tracking-wider mb-1 block">⏱ Projected Timeline</span>
                <span className="text-[11px] text-foreground font-body whitespace-pre-line leading-relaxed">{result.timeline}</span>
              </div>
            )}

            <div className="grid gap-3">
              {result.diet && <RecommendationSection icon="🥗" title="Nutrition Protocol" content={result.diet} color="border-green-500/40" />}
              {result.exercise && <RecommendationSection icon="🏋️" title="Training Regimen" content={result.exercise} color="border-blue-500/40" />}
              {result.medical && <RecommendationSection icon="⚕️" title="Medical Baseline" content={result.medical} color="border-amber-500/40" />}
              {result.supplements && <RecommendationSection icon="💊" title="Supplementation" content={result.supplements} color="border-pink-500/40" />}
            </div>

            {result.disclaimer && (
              <p className="text-[10px] text-muted-foreground/70 font-body italic leading-relaxed pt-2">
                ⚠️ {result.disclaimer}
              </p>
            )}

            {/* Action Footer */}
            <div className="mt-4 pt-4 border-t flex justify-end gap-3">
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setResult(null)}>
                <RefreshCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => window.print()}>
                <Download className="w-3 h-3 mr-1" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Kept your custom section logic, just tweaked the styling slightly to match the premium feel
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
  <div className={`p-3 rounded-lg border shadow-sm ${color} bg-background space-y-2 hover:shadow-md transition-shadow`}>
    <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
      <span className="text-base">{icon}</span> {title}
    </h4>
    <div className="text-[11px] text-foreground/80 font-body leading-relaxed prose prose-xs dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);

export default RecommendationPanel;