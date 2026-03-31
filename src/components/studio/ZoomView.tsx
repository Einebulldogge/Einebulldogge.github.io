import { X, ZoomIn } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ZoomSlider {
  key: string;
  label: string;
  value: number;
  region: string;
}

const zoneConfig: { zone: string; label: string; top: string; height: string; sliders: { key: string; label: string }[] }[] = [
  {
    zone: "head",
    label: "Head & Neck",
    top: "5%",
    height: "18%",
    sliders: [
      { key: "jawline", label: "Jawline Definition" },
      { key: "neckSize", label: "Neck Width" },
      { key: "faceWidth", label: "Face Width" },
    ],
  },
  {
    zone: "upper",
    label: "Upper Body",
    top: "23%",
    height: "22%",
    sliders: [
      { key: "shoulderWidth", label: "Shoulder Width" },
      { key: "chestSize", label: "Chest Size" },
      { key: "armSize", label: "Arm Size" },
      { key: "upperBack", label: "Upper Back" },
    ],
  },
  {
    zone: "core",
    label: "Core",
    top: "45%",
    height: "15%",
    sliders: [
      { key: "waistSize", label: "Waist Size" },
      { key: "abDefinition", label: "Ab Definition" },
      { key: "loveHandles", label: "Love Handles" },
    ],
  },
  {
    zone: "lower",
    label: "Lower Body",
    top: "60%",
    height: "35%",
    sliders: [
      { key: "hipSize", label: "Hip Size" },
      { key: "gluteSize", label: "Glute Size" },
      { key: "thighSize", label: "Thigh Size" },
      { key: "calfSize", label: "Calf Size" },
    ],
  },
];

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

  // Compute transforms from detail sliders
  const getTransformStyle = () => {
    const sw = (detailSliders.shoulderWidth ?? 50) / 100;
    const cs = (detailSliders.chestSize ?? 50) / 100;
    const ws = (detailSliders.waistSize ?? 50) / 100;
    const hs = (detailSliders.hipSize ?? 50) / 100;
    const h = (detailSliders.height ?? 50) / 100;

    return {
      transform: `scaleX(${0.9 + sw * 0.2}) scaleY(${0.85 + h * 0.3})`,
    };
  };

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
      <aside className="w-72 lg:w-80 border-r border-border bg-card overflow-y-auto flex-shrink-0 p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Detail Mode
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Click a body zone on the avatar to fine-tune that area.
          </p>

          <div className="h-px bg-border" />

          {/* Zone buttons */}
          <div className="grid grid-cols-2 gap-2">
            {zoneConfig.map((z) => (
              <button
                key={z.zone}
                onClick={() => onZoneClick(activeZone === z.zone ? null : z.zone)}
                className={`text-xs font-body px-3 py-2 rounded-lg border transition-colors ${
                  activeZone === z.zone
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Active zone sliders */}
          {activeConfig && (
            <div className="space-y-5 pt-2 animate-fade-in">
              <h4 className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
                {activeConfig.label}
              </h4>
              {activeConfig.sliders.map((s) => (
                <div key={s.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground/80 font-body">
                      {s.label}
                    </label>
                    <span className="text-xs text-muted-foreground font-body tabular-nums">
                      {detailSliders[s.key] ?? 50}%
                    </span>
                  </div>
                  <Slider
                    value={[detailSliders[s.key] ?? 50]}
                    onValueChange={(v) => onSliderChange(s.key, v[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {!activeConfig && (
            <p className="text-xs text-muted-foreground/60 font-body text-center pt-4">
              Select a zone above or click on the avatar to begin editing.
            </p>
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

        <div className="relative w-64 h-[28rem] md:w-80 md:h-[36rem] rounded-2xl border border-primary/30 bg-card/50 overflow-hidden shadow-gold">
          <img
            src={imageSrc}
            alt="Zoomed goal avatar"
            className="w-full h-full object-contain p-4 transition-transform duration-300"
            style={getTransformStyle()}
          />

          {/* Clickable zones */}
          {zoneConfig.map((z) => (
            <button
              key={z.zone}
              onClick={() => onZoneClick(activeZone === z.zone ? null : z.zone)}
              className={`absolute left-0 right-0 transition-all duration-200 ${
                activeZone === z.zone
                  ? "bg-primary/10 border-y border-primary/30"
                  : "hover:bg-primary/5"
              }`}
              style={{ top: z.top, height: z.height }}
            >
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-body uppercase tracking-wider transition-opacity ${
                  activeZone === z.zone ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                }`}
                style={{ opacity: activeZone === z.zone ? 1 : undefined }}
              >
                {z.label}
              </span>
            </button>
          ))}

          {/* Zone labels on hover - always visible hint */}
          {!activeZone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground/50 font-body animate-pulse">
                Click a body zone
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ZoomView;
