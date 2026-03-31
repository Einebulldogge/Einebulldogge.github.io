import { X, ZoomIn, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const zoneConfig: {
  zone: string;
  label: string;
  icon: string;
  // Image positioning: objectPosition + scale to "zoom" into the zone
  objectPosition: string;
  imageScale: number;
  // Zone overlay position on full avatar
  top: string;
  height: string;
  sliders: { key: string; label: string; category: "shape" | "skin" | "muscle" }[];
}[] = [
  {
    zone: "head",
    label: "Head & Neck",
    icon: "👤",
    objectPosition: "50% 10%",
    imageScale: 2.8,
    top: "5%",
    height: "18%",
    sliders: [
      { key: "jawline", label: "Jawline Definition", category: "shape" },
      { key: "neckSize", label: "Neck Width", category: "shape" },
      { key: "faceWidth", label: "Face Width", category: "shape" },
      { key: "foreheadWrinkles", label: "Forehead Wrinkle Reduction", category: "skin" },
      { key: "crowsFeet", label: "Crow's Feet Reduction", category: "skin" },
      { key: "neckLines", label: "Neck Line Smoothing", category: "skin" },
      { key: "skinTightness", label: "Skin Tightness", category: "skin" },
      { key: "chinDefinition", label: "Chin Definition", category: "shape" },
    ],
  },
  {
    zone: "upper",
    label: "Upper Body",
    icon: "💪",
    objectPosition: "50% 30%",
    imageScale: 2.4,
    top: "23%",
    height: "22%",
    sliders: [
      { key: "shoulderWidth", label: "Shoulder Width", category: "shape" },
      { key: "chestSize", label: "Chest Size", category: "shape" },
      { key: "armSize", label: "Arm Size", category: "shape" },
      { key: "upperBack", label: "Upper Back Width", category: "shape" },
      { key: "deltoidTone", label: "Deltoid Toning", category: "muscle" },
      { key: "bicepTone", label: "Bicep Definition", category: "muscle" },
      { key: "tricepTone", label: "Tricep Definition", category: "muscle" },
      { key: "pectoralTone", label: "Pectoral Toning", category: "muscle" },
      { key: "chestWrinkles", label: "Chest Wrinkle Reduction", category: "skin" },
      { key: "armSkinTone", label: "Arm Skin Tightening", category: "skin" },
    ],
  },
  {
    zone: "core",
    label: "Core & Midsection",
    icon: "🔥",
    objectPosition: "50% 52%",
    imageScale: 2.6,
    top: "45%",
    height: "30%",
    sliders: [
      { key: "waistSize", label: "Waist Size", category: "shape" },
      { key: "abDefinition", label: "Ab Definition", category: "muscle" },
      { key: "loveHandles", label: "Love Handles Reduction", category: "shape" },
      { key: "obliqueTone", label: "Oblique Toning", category: "muscle" },
      { key: "lowerAbTone", label: "Lower Ab Toning", category: "muscle" },
      { key: "stomachWrinkles", label: "Stomach Skin Tightening", category: "skin" },
      { key: "stretchMarks", label: "Stretch Mark Reduction", category: "skin" },
      { key: "vTaper", label: "V-Taper Enhancement", category: "shape" },
    ],
  },
  {
    zone: "lower",
    label: "Lower Body",
    icon: "🦵",
    objectPosition: "50% 78%",
    imageScale: 2.2,
    top: "60%",
    height: "35%",
    sliders: [
      { key: "hipSize", label: "Hip Size", category: "shape" },
      { key: "gluteSize", label: "Glute Size", category: "shape" },
      { key: "gluteTone", label: "Glute Toning", category: "muscle" },
      { key: "thighSize", label: "Thigh Size", category: "shape" },
      { key: "quadTone", label: "Quad Definition", category: "muscle" },
      { key: "hamstringTone", label: "Hamstring Toning", category: "muscle" },
      { key: "calfSize", label: "Calf Size", category: "shape" },
      { key: "calfTone", label: "Calf Toning", category: "muscle" },
      { key: "thighSkin", label: "Thigh Skin Tightening", category: "skin" },
      { key: "celluliteReduction", label: "Cellulite Reduction", category: "skin" },
      { key: "kneeArea", label: "Knee Area Smoothing", category: "skin" },
    ],
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  shape: { label: "Shape & Size", color: "text-primary" },
  muscle: { label: "Muscle Toning", color: "text-blue-400" },
  skin: { label: "Skin & Texture", color: "text-emerald-400" },
};

interface ZoomViewProps {
  imageSrc: string;
  detailSliders: Record<string, number>;
  onSliderChange: (key: string, value: number) => void;
  onClose: () => void;
  activeZone: string | null;
  onZoneClick: (zone: string | null) => void;
}

const ZoomView = ({ imageSrc, detailSliders, onSliderChange, onClose, activeZone, onZoneClick }: ZoomViewProps) => {
  const activeConfig = zoneConfig.find((z) => z.zone === activeZone);

  // Group sliders by category
  const groupedSliders = activeConfig
    ? activeConfig.sliders.reduce<Record<string, typeof activeConfig.sliders>>((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
      }, {})
    : {};

  const v = (key: string) => (detailSliders[key] ?? 50) / 100; // 0-1 normalized

  // Compute visual effects from all sliders
  const getImageStyle = (): React.CSSProperties => {
    // --- Shape transforms ---
    const shoulderW = 0.9 + v("shoulderWidth") * 0.2;
    const chestW = 0.9 + v("chestSize") * 0.2;
    const waistW = 1.1 - v("waistSize") * 0.2; // inverse: higher = slimmer
    const hipW = 0.9 + v("hipSize") * 0.2;
    const jawDef = 0.95 + v("jawline") * 0.1;
    const faceW = 0.9 + v("faceWidth") * 0.2;
    const gluteS = 0.95 + v("gluteSize") * 0.1;
    const thighS = 0.95 + v("thighSize") * 0.1;
    const neckW = 0.95 + v("neckSize") * 0.1;
    const vTaper = v("vTaper");
    const loveHandles = 1.05 - v("loveHandles") * 0.1; // higher = less love handles

    // Composite shape: average relevant shape sliders for current zone
    let scaleX = 1;
    let scaleY = 1;
    if (activeZone === "head") {
      scaleX = (jawDef + faceW + neckW) / 3;
      scaleY = 0.95 + v("chinDefinition") * 0.1;
    } else if (activeZone === "upper") {
      scaleX = (shoulderW + chestW) / 2;
      scaleY = 0.95 + v("upperBack") * 0.1;
    } else if (activeZone === "core") {
      scaleX = (waistW + loveHandles) / 2;
      scaleY = 0.95 + vTaper * 0.1;
    } else if (activeZone === "lower") {
      scaleX = (hipW + gluteS + thighS) / 3;
      scaleY = 0.95 + v("calfSize") * 0.1;
    }

    // --- Muscle effects (contrast & sharpness) ---
    const muscleToneKeys = activeConfig?.sliders.filter(s => s.category === "muscle").map(s => s.key) || [];
    const avgMuscleTone = muscleToneKeys.length > 0
      ? muscleToneKeys.reduce((sum, k) => sum + v(k), 0) / muscleToneKeys.length
      : 0.5;
    const contrast = 0.85 + avgMuscleTone * 0.35; // 0.85 to 1.2
    const saturate = 0.9 + avgMuscleTone * 0.3; // 0.9 to 1.2

    // --- Skin effects (smoothing & brightness) ---
    const skinKeys = activeConfig?.sliders.filter(s => s.category === "skin").map(s => s.key) || [];
    const avgSkinSmooth = skinKeys.length > 0
      ? skinKeys.reduce((sum, k) => sum + v(k), 0) / skinKeys.length
      : 0.5;
    const blur = avgSkinSmooth * 0.8; // 0 to 0.8px blur for smoothing
    const brightness = 0.95 + avgSkinSmooth * 0.12; // subtle glow

    const baseZoom = activeConfig
      ? { transform: `scale(${activeConfig.imageScale}) scaleX(${scaleX}) scaleY(${scaleY})`, transformOrigin: activeConfig.objectPosition }
      : { transform: "scale(1) scaleX(1) scaleY(1)", transformOrigin: "50% 50%" };

    return {
      ...baseZoom,
      filter: `contrast(${contrast}) saturate(${saturate}) brightness(${brightness}) blur(${blur}px)`,
      transition: "all 0.5s ease-out",
    };
  };

  const handleResetZone = () => {
    if (!activeConfig) return;
    activeConfig.sliders.forEach((s) => onSliderChange(s.key, 50));
  };

  const modifiedCount = activeConfig
    ? activeConfig.sliders.filter((s) => (detailSliders[s.key] ?? 50) !== 50).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex animate-fade-in">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Left: Zone sliders */}
      <aside className="w-80 lg:w-96 border-r border-border bg-card overflow-y-auto flex-shrink-0 p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Detail Editor
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Select a body zone to zoom in and make precise adjustments.
          </p>

          <div className="h-px bg-border" />

          {/* Zone buttons */}
          <div className="grid grid-cols-2 gap-2">
            {zoneConfig.map((z) => {
              const zoneModified = z.sliders.filter((s) => (detailSliders[s.key] ?? 50) !== 50).length;
              return (
                <button
                  key={z.zone}
                  onClick={() => onZoneClick(activeZone === z.zone ? null : z.zone)}
                  className={`relative text-xs font-body px-3 py-2.5 rounded-lg border transition-all duration-200 text-left ${
                    activeZone === z.zone
                      ? "border-primary bg-primary/10 text-primary scale-[1.02]"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{z.icon}</span>
                    {z.label}
                  </span>
                  {zoneModified > 0 && (
                    <span className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                      {zoneModified}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-border" />

          {/* Active zone sliders grouped by category */}
          {activeConfig && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span>{activeConfig.icon}</span>
                  {activeConfig.label}
                </h4>
                <button
                  onClick={handleResetZone}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors font-body"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  Reset zone
                </button>
              </div>

              {modifiedCount > 0 && (
                <div className="text-[10px] text-muted-foreground font-body">
                  {modifiedCount} adjustment{modifiedCount > 1 ? "s" : ""} made
                </div>
              )}

              {Object.entries(groupedSliders).map(([category, sliders]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      category === "shape" ? "bg-primary" : category === "muscle" ? "bg-blue-400" : "bg-emerald-400"
                    }`} />
                    <span className={`text-[10px] font-display font-semibold uppercase tracking-widest ${categoryLabels[category]?.color}`}>
                      {categoryLabels[category]?.label}
                    </span>
                  </div>
                  {sliders.map((s) => {
                    const val = detailSliders[s.key] ?? 50;
                    const isModified = val !== 50;
                    return (
                      <div key={s.key} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className={`text-xs font-body ${isModified ? "text-foreground font-medium" : "text-foreground/60"}`}>
                            {s.label}
                          </label>
                          <span className={`text-[10px] font-body tabular-nums ${isModified ? "text-primary" : "text-muted-foreground"}`}>
                            {val}%
                          </span>
                        </div>
                        <Slider
                          value={[val]}
                          onValueChange={(v) => onSliderChange(s.key, v[0])}
                          max={100}
                          min={0}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {!activeConfig && (
            <div className="text-center py-8 space-y-3">
              <div className="text-3xl">👆</div>
              <p className="text-xs text-muted-foreground/60 font-body">
                Select a zone to zoom in and access detailed controls for shape, muscle toning, and skin texture.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Center: Zoomed avatar */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative w-72 h-[30rem] md:w-96 md:h-[38rem] rounded-2xl border border-primary/30 bg-card/50 overflow-hidden shadow-gold">
          {/* Image with zoom crop */}
          <div className="w-full h-full overflow-hidden">
            <img
              src={imageSrc}
              alt="Zoomed goal avatar"
              className="w-full h-full object-cover transition-all duration-500 ease-out"
              style={getImageStyle()}
            />
          </div>

          {/* Zone label overlay */}
          {activeConfig && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between animate-fade-in">
              <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-primary bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/20">
                {activeConfig.icon} {activeConfig.label}
              </span>
              <span className="text-[9px] font-body text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                {activeConfig.sliders.length} controls
              </span>
            </div>
          )}

          {/* Clickable zones (only visible when not zoomed) */}
          {!activeZone && zoneConfig.map((z) => (
            <button
              key={z.zone}
              onClick={() => onZoneClick(z.zone)}
              className="absolute left-0 right-0 transition-all duration-200 hover:bg-primary/10 group border-y border-transparent hover:border-primary/20"
              style={{ top: z.top, height: z.height }}
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-body text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md whitespace-nowrap">
                {z.icon} {z.label}
              </span>
            </button>
          ))}

          {/* Zoom out button when zoomed in */}
          {activeZone && (
            <button
              onClick={() => onZoneClick(null)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-body text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors animate-fade-in"
            >
              Zoom out
            </button>
          )}

          {/* Hint when no zone selected */}
          {!activeZone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground/40 font-body animate-pulse">
                Hover to select a zone
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ZoomView;
