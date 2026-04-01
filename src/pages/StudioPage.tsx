import { useState, useCallback, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw, Download, ChevronLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import ZoomView from "@/components/studio/ZoomView";
import { RecommendationPanel, HealthPlanDisplay, DEMO_RESULT } from "@/components/ui/RecommendationPanel";

interface BodySliders {
  height: number;
  shoulderWidth: number;
  chestSize: number;
  waistSize: number;
  hipSize: number;
  armSize: number;
  legLength: number;
  muscleTone: number;
  bodyFat: number;
  neckSize: number;
  jawline: number;
}

const defaultSliders: BodySliders = {
  height: 50,
  shoulderWidth: 50,
  chestSize: 50,
  waistSize: 50,
  hipSize: 50,
  armSize: 50,
  legLength: 50,
  muscleTone: 50,
  bodyFat: 50,
  neckSize: 50,
  jawline: 50,
};

const sliderConfig: { key: keyof BodySliders; label: string; icon: string }[] = [
  { key: "height", label: "Height", icon: "↕" },
  { key: "shoulderWidth", label: "Shoulder Width", icon: "↔" },
  { key: "chestSize", label: "Chest", icon: "◻" },
  { key: "waistSize", label: "Waist", icon: "◇" },
  { key: "hipSize", label: "Hips", icon: "◯" },
  { key: "armSize", label: "Arms", icon: "💪" },
  { key: "legLength", label: "Legs", icon: "🦵" },
  { key: "muscleTone", label: "Muscle Tone", icon: "⚡" },
  { key: "bodyFat", label: "Body Fat %", icon: "📊" },
  { key: "neckSize", label: "Neck", icon: "○" },
  { key: "jawline", label: "Jawline Definition", icon: "📐" },
];

const StudioPage = () => {
  const [sliders, setSliders] = useState<BodySliders>(defaultSliders);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [detailSliders, setDetailSliders] = useState<Record<string, number>>({});
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // --- AI PLAN STATE ---
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [healthPlan, setHealthPlan] = useState<any>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingMessages = [
    "Analyzing biometrics...",
    "Cross-referencing longevity markers...",
    "Optimizing macros & workout split...",
    "Finalizing personalized protocol...",
  ];

  useEffect(() => {
    if (!isGeneratingPlan) return;
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [isGeneratingPlan]);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setLoadingPhase(0);
    setHealthPlan(null);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setHealthPlan(DEMO_RESULT);
    }, 2500);
  };

  const handleSliderChange = useCallback((key: keyof BodySliders, value: number[]) => {
    setSliders((prev) => ({ ...prev, [key]: value[0] }));
  }, []);

  const handleReset = () => setSliders(defaultSliders);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- REVISED MATH ENGINE ---
  const sv = (key: keyof BodySliders) => sliders[key] / 100; 
  const sd = (key: keyof BodySliders) => sv(key) - 0.5; 

  // 1. DEFINITION TOOLS (Lighting & Texture Only - NO SCALING)
  // Jawline: Deepens shadows and increases local contrast to carve the jaw.
  const jawContrast = 1 + sd("jawline") * 0.8; // High contrast sharpens facial features
  const jawBrightness = 1 - sd("jawline") * 0.15; // Slightly darkens to create hollows
  
  // Muscle & Fat: Manipulates skin texture
  const muscleTone = sv("muscleTone");
  const baseContrast = 1 + (muscleTone - 0.5) * 0.4 - sd("bodyFat") * 0.2;
  const baseSaturate = 1 + (muscleTone - 0.5) * 0.3;
  const baseBrightness = 1 - sd("bodyFat") * 0.1;
  const blurAmount = Math.max(0, sd("bodyFat") * 2.5); // Softens features for high fat
  
  const bodyFilter = `contrast(${baseContrast}) saturate(${baseSaturate}) brightness(${baseBrightness}) blur(${blurAmount}px)`;
  const faceFilter = `contrast(${jawContrast}) brightness(${jawBrightness}) blur(${blurAmount * 0.2}px)`;

  // 2. STRUCTURAL TOOLS (Highly Constrained Scaling)
  // Max scale is limited to 4-10% to prevent the "Funhouse Mirror" distortion.
  const shoulderScale = 1 + sd("shoulderWidth") * 0.12;
  const chestScaleY = 1 + sd("chestSize") * 0.08;
  const waistScale = 1 - sd("waistSize") * 0.15 + sd("bodyFat") * 0.08;
  const hipScale = 1 + sd("hipSize") * 0.12;
  const legScaleY = 1 + sd("legLength") * 0.08;
  const overallHeight = 1 + sd("height") * 0.05;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm font-body">Back</span>
        </Link>
        <div className="flex-1 text-center">
          <span className="font-display text-lg font-bold text-gradient-gold">Taylour Studio</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="h-3 w-3 mr-1" /> Save
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 lg:w-80 border-r border-border bg-card overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-6">
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">Your Photo</h3>
              <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/30">
                <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground font-body">{uploadedImage ? "Change photo" : "Upload a photo"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">Body Tools</h3>
                <button onClick={handleReset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-body">
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              <div className="space-y-5 pt-2">
                {sliderConfig.map(({ key, label, icon }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground/80 font-body flex items-center gap-2">
                        <span className="text-sm">{icon}</span> {label}
                      </label>
                      <span className="text-xs text-muted-foreground font-body tabular-nums">{sliders[key]}%</span>
                    </div>
                    <Slider value={[sliders[key]]} onValueChange={(v) => handleSliderChange(key, v)} max={100} min={0} step={1} className="cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />
            <RecommendationPanel bodyGoals={{ ...sliders, ...detailSliders }} onGenerate={handleGeneratePlan} loading={isGeneratingPlan} />
          </div>
        </aside>

        <main className="flex-1 flex justify-center relative bg-background overflow-y-auto pt-12 pb-24">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative flex flex-col items-center gap-6 max-w-4xl w-full">
            <div className="flex gap-16 text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
              <span>Current</span>
              <span className="text-primary font-bold">Goal</span>
            </div>

            <div className="flex items-end gap-8 md:gap-16">
              
              {/* CURRENT IMAGE */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-40 h-72 md:w-56 md:h-96 rounded-2xl border border-border bg-card/50 overflow-hidden flex items-center justify-center">
                  <img src={uploadedImage || avatarPlaceholder} alt="Current" className="w-full h-full object-contain p-2 grayscale-[0.2]" />
                </div>
              </div>

              {/* ARROW */}
              <div className="flex flex-col items-center gap-2 pb-24">
                <div className="w-8 h-px bg-gradient-to-r from-border via-primary to-border" />
                <span className="text-[10px] text-primary font-body uppercase tracking-wider">Transform</span>
                <div className="w-8 h-px bg-gradient-to-r from-border via-primary to-border" />
              </div>

              {/* --- REALISTIC LAYERED GOAL IMAGE --- */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative w-40 h-72 md:w-56 md:h-96 rounded-2xl border border-primary/40 bg-card/50 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.1)] cursor-pointer group transition-transform hover:scale-[1.02]"
                  onClick={() => setZoomOpen(true)}
                  style={{ transform: `scaleY(${overallHeight})` }} 
                >
                  
                  {/* BASE LAYER (Legs & Background) */}
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    className="absolute inset-0 w-full h-full object-contain p-2 origin-bottom transition-all duration-300"
                    style={{
                      transform: `scaleY(${legScaleY}) scaleX(${hipScale})`,
                      filter: bodyFilter,
                    }}
                  />

                  {/* WAIST LAYER */}
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    className="absolute inset-0 w-full h-full object-contain p-2 origin-center transition-all duration-300"
                    style={{
                      transform: `scaleX(${waistScale})`,
                      filter: bodyFilter,
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 35%, black 45%, black 60%, transparent 70%)",
                      maskImage: "linear-gradient(to bottom, transparent 35%, black 45%, black 60%, transparent 70%)",
                    }}
                  />

                  {/* CHEST & SHOULDER LAYER */}
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    className="absolute inset-0 w-full h-full object-contain p-2 origin-top transition-all duration-300"
                    style={{
                      transform: `scaleX(${shoulderScale}) scaleY(${chestScaleY})`,
                      filter: bodyFilter,
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 15%, black 25%, black 40%, transparent 50%)",
                      maskImage: "linear-gradient(to bottom, transparent 15%, black 25%, black 40%, transparent 50%)",
                    }}
                  />

                  {/* HEAD & JAWLINE LAYER (Zero Scaling Applied) */}
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    className="absolute inset-0 w-full h-full object-contain p-2 origin-top transition-all duration-300"
                    style={{
                      // Notice: No transform scale applied here! Head stays exactly the same size.
                      filter: faceFilter,
                      WebkitMaskImage: "linear-gradient(to bottom, black 5%, black 20%, transparent 32%)",
                      maskImage: "linear-gradient(to bottom, black 5%, black 20%, transparent 32%)",
                    }}
                  />

                  {/* Hover Hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="text-xs text-primary font-body font-medium flex items-center gap-2">
                      <Search className="w-4 h-4" /> Click to zoom
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI HEALTH PLAN DISPLAY */}
            <div className="w-full mt-12 mb-12">
              <HealthPlanDisplay result={healthPlan} loading={isGeneratingPlan} loadingPhaseText={loadingMessages[loadingPhase]} onReset={() => setHealthPlan(null)} />
            </div>

          </div>
        </main>
      </div>

      {zoomOpen && (
        <ZoomView imageSrc={uploadedImage || avatarPlaceholder} detailSliders={detailSliders} onSliderChange={(key, value) => setDetailSliders((prev) => ({ ...prev, [key]: value }))} onClose={() => setZoomOpen(false)} activeZone={activeZone} onZoneClick={setActiveZone} />
      )}
    </div>
  );
};

export default StudioPage;