import { useState, useCallback, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw, Download, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import ZoomView from "@/components/studio/ZoomView";
import { RecommendationPanel, HealthPlanDisplay, DEMO_RESULT } from "@/components/ui/RecommendationPanel"; // Note the 3 imports

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
];

const StudioPage = () => {
  const [sliders, setSliders] = useState<BodySliders>(defaultSliders);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [detailSliders, setDetailSliders] = useState<Record<string, number>>({});
  const [activeZone, setActiveZone] = useState<string | null>(null);
  // --- NEW AI PLAN STATE START ---
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

    // Simulated API Delay
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setHealthPlan(DEMO_RESULT);
    }, 2500);
  };
  // --- NEW AI PLAN STATE END ---

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

  // Compute CSS transforms based on slider values — each slider drives a distinct visual effect
  const sv = (key: keyof BodySliders) => sliders[key] / 100; // 0-1
  const sd = (key: keyof BodySliders) => sv(key) - 0.5; // -0.5 to 0.5 deviation

  // Shape transforms — each body part contributes differently
  const avatarTransforms = {
    scaleY: 1 + sd("height") * 0.2,         // height stretches vertically
    scaleX: 1 + sd("shoulderWidth") * 0.12,  // shoulders widen frame
  };

  // Body part overlay sizes driven by their specific sliders
  const chestScale = 0.85 + sv("chestSize") * 0.3;
  const waistScale = 1.15 - sv("waistSize") * 0.3; // inverse: higher = slimmer
  const hipScale = 0.85 + sv("hipSize") * 0.3;

  // Muscle tone: increases contrast & shadow depth for definition
  const muscleTone = sv("muscleTone");
  const goalContrast = 0.88 + muscleTone * 0.3;
  const goalSaturate = 0.85 + muscleTone * 0.35;
  // Drop shadow for muscle depth
  const muscleShadow = Math.max(0, (muscleTone - 0.5) * 0.4);
  const dropShadow = muscleShadow > 0 ? `drop-shadow(0 2px ${2 + muscleShadow * 6}px rgba(0,0,0,${muscleShadow}))` : "";

  // Body fat: higher = softer/smoother (blur + brightness reduction)
  const bodyFat = sv("bodyFat");
  const goalBrightness = 1.05 - bodyFat * 0.12;
  const goalBlur = bodyFat * 0.5;  // more fat = softer/less defined
  // Neck adds slight width
  const neckEffect = sd("neckSize") * 0.03;

  // Arm size subtly widens upper body
  const armEffect = sd("armSize") * 0.04;
  // Leg length stretches lower half
  const legEffect = sd("legLength") * 0.06;

  const goalFilter = [
    `contrast(${goalContrast.toFixed(2)})`,
    `saturate(${goalSaturate.toFixed(2)})`,
    `brightness(${goalBrightness.toFixed(2)})`,
    goalBlur > 0.05 ? `blur(${goalBlur.toFixed(2)}px)` : "",
    dropShadow,
  ].filter(Boolean).join(" ");

  const goalTransformX = avatarTransforms.scaleX + neckEffect + armEffect;
  const goalTransformY = avatarTransforms.scaleY + legEffect;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm font-body">Back</span>
        </Link>
        <div className="flex-1 text-center">
          <span className="font-display text-lg font-bold text-gradient-gold">Taylour Studio</span>
        </div>
        <Button variant="hero" size="sm" className="text-xs">
          <Download className="h-3 w-3 mr-1" />
          Save
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Tools Sidebar */}
        <aside className="w-72 lg:w-80 border-r border-border bg-card overflow-y-auto flex-shrink-0">
          <div className="p-5 space-y-6">
            {/* Upload Section */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                Your Photo
              </h3>
              <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/30">
                <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground font-body">
                  {uploadedImage ? "Change photo" : "Upload a photo"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Body Modification Tools */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                  Body Tools
                </h3>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-body"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              <div className="space-y-5 pt-2">
                {sliderConfig.map(({ key, label, icon }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground/80 font-body flex items-center gap-2">
                        <span className="text-sm">{icon}</span>
                        {label}
                      </label>
                      <span className="text-xs text-muted-foreground font-body tabular-nums">
                        {sliders[key]}%
                      </span>
                    </div>
                    <Slider
                      value={[sliders[key]]}
                      onValueChange={(v) => handleSliderChange(key, v)}
                      max={100}
                      min={0}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* AI Recommendation Panel */}
            <RecommendationPanel 
              bodyGoals={{ ...sliders, ...detailSliders }} 
              onGenerate={handleGeneratePlan} 
              loading={isGeneratingPlan} 
            />
          </div>
        </aside>

        {/* Canvas / Avatar Area */}
        <main className="flex-1 flex justify-center relative bg-background overflow-y-auto pt-12 pb-24">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Before / After Labels */}
            <div className="flex gap-16 text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
              <span>Current</span>
              <span className="text-primary">Goal</span>
            </div>

            <div className="flex items-end gap-8 md:gap-16">
              {/* Current (original) */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-40 h-72 md:w-48 md:h-80 rounded-2xl border border-border bg-card/50 overflow-hidden flex items-center justify-center">
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    alt="Current you"
                    className="w-full h-full object-contain p-2"
                    style={{ filter: uploadedImage ? "none" : "none" }}
                  />
                  {!uploadedImage && (
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <span className="text-[10px] text-muted-foreground font-body bg-background/80 px-2 py-1 rounded-md">
                        Upload photo to see your cartoon
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transformation arrow */}
              <div className="flex flex-col items-center gap-2 pb-20">
                <div className="w-12 h-px bg-gradient-to-r from-border via-primary to-border" />
                <span className="text-[10px] text-primary font-body uppercase tracking-wider">Transform</span>
                <div className="w-12 h-px bg-gradient-to-r from-border via-primary to-border" />
              </div>

              {/* Goal (transformed) */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative w-40 h-72 md:w-48 md:h-80 rounded-2xl border border-primary/30 bg-card/50 overflow-hidden flex items-center justify-center shadow-gold cursor-pointer group"
                  onClick={() => setZoomOpen(true)}
                >
                  <img
                    src={uploadedImage || avatarPlaceholder}
                    alt="Goal you"
                    className="w-full h-full object-contain p-2 transition-all duration-300"
                    style={{
                      transform: `scaleX(${goalTransformX.toFixed(3)}) scaleY(${goalTransformY.toFixed(3)})`,
                      filter: goalFilter,
                    }}
                  />
                  {/* Overlay indicators for body modifications */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute left-1/2 -translate-x-1/2 border border-primary/20 rounded-full transition-all duration-300"
                      style={{ top: "28%", width: `${chestScale * 60}%`, height: "12%", background: "hsl(var(--primary) / 0.05)" }}
                    />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 border border-primary/20 rounded-full transition-all duration-300"
                      style={{ top: "45%", width: `${waistScale * 45}%`, height: "10%", background: "hsl(var(--primary) / 0.05)" }}
                    />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 border border-primary/20 rounded-full transition-all duration-300"
                      style={{ top: "55%", width: `${hipScale * 55}%`, height: "10%", background: "hsl(var(--primary) / 0.05)" }}
                    />
                  </div>
                  {/* Zoom hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-primary font-body font-medium">Click to zoom & edit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status text */}
            <p className="text-xs text-muted-foreground font-body max-w-md text-center">
              Adjust the sliders on the left to visualize your transformation goals.
              Your photo stays completely private — only you can see it.
            </p>
            {/* --- AI HEALTH PLAN DISPLAY --- */}
            <div className="w-full max-w-3xl mt-12 mb-12">
              <HealthPlanDisplay 
                result={healthPlan} 
                loading={isGeneratingPlan} 
                loadingPhaseText={loadingMessages[loadingPhase]}
                onReset={() => setHealthPlan(null)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Zoom Detail View */}
      {zoomOpen && (
        <ZoomView
          imageSrc={uploadedImage || avatarPlaceholder}
          detailSliders={detailSliders}
          onSliderChange={(key, value) => setDetailSliders((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setZoomOpen(false)}
          activeZone={activeZone}
          onZoneClick={setActiveZone}
        />
      )}
    </div>
  );
};

export default StudioPage;
