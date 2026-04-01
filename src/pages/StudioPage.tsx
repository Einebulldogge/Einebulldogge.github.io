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

  // --- ANATOMICAL SLICING MATH ENGINE ---
  const sv = (key: keyof BodySliders) => sliders[key] / 100; 
  const sd = (key: keyof BodySliders) => sv(key) - 0.5; 

  // Physical Morphing Math (X-Axis only to prevent vertical gaps)
  // These are much more aggressive now because they are isolated!
  const jawScaleX = 1 - sd("jawline") * 0.25; // Physically shrinks jawline inwards up to 12.5%
  const neckScaleX = 1 + sd("neckSize") * 0.3;
  const shoulderScaleX = 1 + sd("shoulderWidth") * 0.35;
  const chestScaleX = 1 + sd("chestSize") * 0.25;
  const waistScaleX = 1 - sd("waistSize") * 0.4 + sd("bodyFat") * 0.15; // Waist shrinks drastically
  const hipScaleX = 1 + sd("hipSize") * 0.3;
  
  // Y-Axis Morphing (Only safe on the very top/bottom to prevent the body tearing apart)
  const legScaleY = 1 + sd("legLength") * 0.25;
  const overallHeight = 1 + sd("height") * 0.15;

  // Texture Math (For muscle definition and fat blur)
  const muscleTone = sv("muscleTone");
  const baseContrast = 1 + (muscleTone - 0.5) * 0.5 - sd("bodyFat") * 0.2;
  const baseSaturate = 1 + (muscleTone - 0.5) * 0.4;
  const baseBrightness = 1 - sd("bodyFat") * 0.1;
  const blurAmount = Math.max(0, sd("bodyFat") * 3); 
  
  const bodyFilter = `contrast(${baseContrast}) saturate(${baseSaturate}) brightness(${baseBrightness}) blur(${blurAmount}px)`;
  const jawFilter = `contrast(${baseContrast + sd("jawline") * 0.5}) brightness(${baseBrightness - sd("jawline") * 0.1})`; // Extra shadow for jaw

  // Define the anatomical slices based on standard human proportions
  const bodySlices = [
    { id: 'top-head', clip: 'polygon(0% 0%, 100% 0%, 100% 12%, 0% 12%)', scaleX: 1, filter: bodyFilter, origin: 'center' },
    { id: 'jawline', clip: 'polygon(0% 12%, 100% 12%, 100% 18%, 0% 18%)', scaleX: jawScaleX, filter: jawFilter, origin: 'center' },
    { id: 'neck', clip: 'polygon(0% 18%, 100% 18%, 100% 23%, 0% 23%)', scaleX: neckScaleX, filter: bodyFilter, origin: 'center' },
    { id: 'shoulders', clip: 'polygon(0% 23%, 100% 23%, 100% 32%, 0% 32%)', scaleX: shoulderScaleX, filter: bodyFilter, origin: 'center' },
    { id: 'chest-arms', clip: 'polygon(0% 32%, 100% 32%, 100% 45%, 0% 45%)', scaleX: chestScaleX, filter: bodyFilter, origin: 'center' },
    { id: 'waist', clip: 'polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)', scaleX: waistScaleX, filter: bodyFilter, origin: 'center' },
    { id: 'hips', clip: 'polygon(0% 55%, 100% 55%, 100% 65%, 0% 65%)', scaleX: hipScaleX, filter: bodyFilter, origin: 'center' },
    { id: 'legs', clip: 'polygon(0% 65%, 100% 65%, 100% 100%, 0% 100%)', scaleX: 1, scaleY: legScaleY, filter: bodyFilter, origin: 'top center' },
  ];

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

              {/* --- REALISTIC ANATOMICAL SLICED IMAGE --- */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative w-40 h-72 md:w-56 md:h-96 rounded-2xl border border-primary/40 bg-card/50 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.1)] cursor-pointer group transition-transform hover:scale-[1.02]"
                  onClick={() => setZoomOpen(true)}
                >
                  {/* Container scales for overall height */}
                  <div className="relative w-full h-full" style={{ transform: `scaleY(${overallHeight})`, transformOrigin: 'bottom center', transition: 'transform 0.3s ease-out' }}>
                    
                    {/* Render each anatomical slice independently */}
                    {bodySlices.map((slice) => (
                      <img
                        key={slice.id}
                        src={uploadedImage || avatarPlaceholder}
                        className="absolute inset-0 w-full h-full object-contain p-2 will-change-transform"
                        style={{
                          clipPath: slice.clip,
                          transform: `scaleX(${slice.scaleX}) ${slice.scaleY ? `scaleY(${slice.scaleY})` : ''}`,
                          transformOrigin: slice.origin,
                          filter: slice.filter,
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out'
                        }}
                      />
                    ))}

                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
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