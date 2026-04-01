import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Download, RefreshCcw, ShoppingCart } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";


export const DEMO_RESULT = {
  summary: "Protocol Alpha: Your plan focuses on optimizing biomarkers and achieving metabolic flexibility. Based on your inputs, we are prioritizing hyper-targeted hypertrophy paired with a strict 16:8 nutritional window to accelerate body recomposition.",
  diet: `**Caloric target:** ~2,400 kcal/day (Controlled deficit for lipolysis while preventing sarcopenia)\n**Macros:** 200g protein · 240g carbs · 65g fat\n\n**Protocol Directives:**\n* **Protein Threshold:** Target 1.8g/kg of lean body mass.\n* **Fasting Window:** Implement a 16:8 Time-Restricted Feeding schedule.\n* **Restriction:** Complete cessation of ultra-processed seed oils and refined fructose to minimize systemic inflammation.`,
  exercise: `**Weekly Split (Optimization Focus):**\n\n* **Zone 2 Stability (Cardio):** 150 minutes per week at Heart Rate Zone 2 to increase mitochondrial density.\n* **V02 Max Loading:** 1 session of 4x4 Norwegian intervals per week to expand cardiovascular capacity.\n* **Hypertrophy (Resistance):** 3 sessions of heavy compound movements. Focus on progressive overload in the 5-8 rep range.\n* **Neurological Recovery:** 1 day dedicated to active mobility and CNS (Central Nervous System) recovery.`,
  medical: `**Baseline Blood Panel Requirements:**\nTo ensure protocol efficacy, request the following from your physician:\n* **ApoB & Lp(a):** Critical markers for cardiovascular risk assessment.\n* **HbA1c & Fasting Insulin:** To measure baseline metabolic flexibility.\n* **Free Testosterone & Thyroid Cascade (TSH, free T3/T4):** To rule out endocrine bottlenecks stalling your fat loss.\n\n**Next Check-in:** Retest biomarkers in exactly 12 weeks to quantify the protocol's systemic impact.`,
  supplements: `**Daily Baseline Stack:**\n\n1.  **AM:** Vitamin D3 (5000 IU) + Vitamin K2 (100mcg) with a fat source to optimize absorption.\n2.  **AM:** Creatine Monohydrate (5g). #1 evidence-backed supplement for intracellular hydration and ATP production.\n3.  **PM:** Magnesium Glycinate or Threonate (400mg) 60 minutes before bed to enhance sleep architecture.\n4.  **PM (Optional):** Apigenin (50mg) to further down-regulate the nervous system pre-sleep.\n\n*Skip redundant BCAAs and thermogenic fat burners. Capital allocation is better spent on whole foods.*`,
  timeline: `**Phase 1 (Weeks 1-4):** Neurological adaptation and insulin sensitivity baseline correction.\n**Phase 2 (Weeks 5-8):** Visible lipolysis (fat loss) and increased mitochondrial capacity.\n**Phase 3 (Weeks 9-12):** Major physique transformation visible. Biomarkers ready for re-testing.`,
  disclaimer: "This algorithmic protocol is for informational purposes only. Consult a clinical physician before beginning any advanced nutritional or physical regimen.",
};

interface RecommendationPanelProps {
  bodyGoals: Record<string, number>;
  onGenerate: () => void;
  loading: boolean;
}

const pathColors: Record<string, string> = { diet: "bg-green-500", exercise: "bg-blue-500", medical: "bg-amber-500", supplements: "bg-pink-500" };
const pathIcons: Record<string, string> = { diet: "🥗", exercise: "🏋️", medical: "⚕️", supplements: "💊" };

// 1. THE SIDEBAR CONTROLS
export function RecommendationPanel({ bodyGoals, onGenerate, loading }: RecommendationPanelProps) {
  const [paths, setPaths] = useState({ diet: 35, exercise: 40, medical: 10, supplements: 15 });

  const handlePathChange = (key: string, value: number[]) => {
    const newVal = value[0];
    const oldVal = paths[key as keyof typeof paths];
    const diff = newVal - oldVal;
    const otherKeys = Object.keys(paths).filter((k) => k !== key) as (keyof typeof paths)[];
    const otherTotal = otherKeys.reduce((sum, k) => sum + paths[k], 0);
    
    if (otherTotal === 0 && diff > 0) return;
    
    const newPaths = { ...paths, [key]: newVal };
    otherKeys.forEach((k) => {
      const proportion = otherTotal > 0 ? paths[k] / otherTotal : 1 / otherKeys.length;
      newPaths[k] = Math.max(0, Math.round(paths[k] - diff * proportion));
    });

    const total = Object.values(newPaths).reduce((s, v) => s + v, 0);
    if (total !== 100) {
      const adjustKey = otherKeys.find((k) => newPaths[k] > 0) || otherKeys[0];
      newPaths[adjustKey] += 100 - total;
    }
    setPaths(newPaths);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Path Customization
        </h3>
      </div>

      <div className="space-y-2 p-4 border rounded-lg bg-card shadow-sm">
        {(Object.keys(paths) as (keyof typeof paths)[]).map((key) => (
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
                <div className={`h-full rounded-full ${pathColors[key]} transition-all duration-300`} style={{ width: `${paths[key]}%` }} />
              </div>
              <Slider value={[paths[key]]} onValueChange={(v) => handlePathChange(key, v)} max={100} min={0} step={5} className="cursor-pointer flex-1" />
            </div>
          </div>
        ))}
      </div>

      {/* The Updated Generate Button Area */}
      <div className="pt-4 border-t border-border mt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-center text-foreground mb-3">
          Specialized Health Plan
        </h4>
        <Button onClick={onGenerate} disabled={loading} className="w-full py-6 transition-all hover:scale-[1.01] shadow-md">
          {loading ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin text-primary-foreground" /> Generating...</>
          ) : (
            <><Sparkles className="h-5 w-5 mr-2" /> Generate</>
          )}
        </Button>
      </div>
    </div>
  );
}

// 2. THE MAIN SCREEN DISPLAY
export function HealthPlanDisplay({ result, loading, loadingPhaseText, onReset }: any) {
  if (!loading && !result) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {loading && !result ? (
        <div className="p-12 rounded-xl border border-primary/20 bg-gradient-to-b from-card to-secondary/10 flex flex-col items-center justify-center space-y-6 shadow-lg">
           <div className="relative">
             <Loader2 className="h-12 w-12 animate-spin text-primary opacity-30" />
             <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
           </div>
           <p className="text-base font-medium text-foreground uppercase tracking-widest text-center animate-pulse">
             {loadingPhaseText || "Synthesizing Data..."}
           </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-gradient-to-b from-card to-secondary/10 shadow-xl">
          <div className="bg-primary/10 px-6 py-3 border-b border-primary/20 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Biometric Analysis Result</span>
            <span className="text-xs text-muted-foreground">Generated {new Date().toLocaleDateString()}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 shadow-inner">
              <p className="text-sm font-body text-foreground font-medium leading-relaxed">{result.summary}</p>
            </div>

            {result.timeline && (
              <div className="p-4 rounded-lg bg-background border shadow-sm">
                <span className="text-xs text-muted-foreground font-body uppercase font-bold tracking-wider mb-2 block">⏱ Projected Timeline</span>
                <span className="text-sm text-foreground font-body whitespace-pre-line leading-relaxed">{result.timeline}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {result.diet && <RecommendationSection icon="🥗" title="Nutrition Protocol" content={result.diet} color="border-green-500/40" />}
              {result.exercise && <RecommendationSection icon="🏋️" title="Training Regimen" content={result.exercise} color="border-blue-500/40" />}
              {result.medical && <RecommendationSection icon="⚕️" title="Medical Baseline" content={result.medical} color="border-amber-500/40" />}
              {result.supplements && <RecommendationSection icon="💊" title="Supplementation" content={result.supplements} color="border-pink-500/40" />}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end gap-3">

              {/* NEW: The Shop Link */}
              <Link to="/store">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(255,215,0,0.2)] text-xs font-bold uppercase tracking-wider">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shop Protocol
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" onClick={onReset}><RefreshCcw className="w-4 h-4 mr-2" /> Reset</Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RecommendationSection = ({ icon, title, content, color }: any) => (
  <div className={`p-4 rounded-lg border shadow-sm ${color} bg-background space-y-2 hover:shadow-md transition-shadow`}>
    <h4 className="text-xs font-display font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
      <span className="text-lg">{icon}</span> {title}
    </h4>
    <div className="text-sm text-foreground/80 font-body leading-relaxed prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);