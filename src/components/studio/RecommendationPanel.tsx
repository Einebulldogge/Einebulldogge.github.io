import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Key, X, Loader2, AlertTriangle, Settings2 } from "lucide-react";
import {
  getGeminiKey,
  setGeminiKey,
  removeGeminiKey,
  getRecommendation,
  type PathPreferences,
  type BodyGoals,
  type RecommendationResult,
} from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

interface RecommendationPanelProps {
  bodyGoals: BodyGoals;
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

const RecommendationPanel = ({ bodyGoals }: RecommendationPanelProps) => {
  const [apiKey, setApiKeyState] = useState(getGeminiKey() || "");
  const [keySet, setKeySet] = useState(!!getGeminiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);

  const [paths, setPaths] = useState<PathPreferences>({
    diet: 40,
    exercise: 35,
    medical: 15,
    supplements: 10,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setKeySet(!!getGeminiKey());
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setGeminiKey(apiKey.trim());
      setKeySet(true);
      setShowKeyInput(false);
    }
  };

  const handleRemoveKey = () => {
    removeGeminiKey();
    setApiKeyState("");
    setKeySet(false);
    setResult(null);
  };

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

    const total = Object.values(newPaths).reduce((s, v) => s + v, 0);
    if (total !== 100) {
      const adjustKey = otherKeys.find((k) => newPaths[k] > 0) || otherKeys[0];
      newPaths[adjustKey] += 100 - total;
    }

    setPaths(newPaths);
  };

  const handleGenerate = async () => {
    const key = getGeminiKey();
    if (!key) {
      setShowKeyInput(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const rec = await getRecommendation(bodyGoals, paths, key);
      setResult(rec);
    } catch (err: any) {
      setError(err.message || "Failed to get recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* MAIN WRAPPER: Centered and responsive */
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ENHANCED PANEL: Larger and prominent */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4">
           {keySet ? (
            <button onClick={handleRemoveKey} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-all">
              <Key className="h-3 w-3" /> Change Key
            </button>
          ) : (
            <button onClick={() => setShowKeyInput(true)} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1.5 font-medium">
              <Key className="h-3.5 w-3.5" /> Set API Key
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Settings2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground tracking-tight text-center">
            AI Path Customization
          </h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
            Balance your strategy. Our AI adjusts the intensity of each pillar to match your physical profile.
          </p>
        </div>

        {/* API Key Input Overlay */}
        {showKeyInput && (
          <div className="mb-8 p-4 rounded-xl border border-primary/30 bg-primary/5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
               <p className="text-xs text-foreground font-medium">Connect Gemini AI</p>
               <Button variant="ghost" size="icon" onClick={() => setShowKeyInput(false)} className="h-6 w-6"><X className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-3">
              <Input
                type="password"
                placeholder="Paste your API Key here..."
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="bg-background/50 h-11"
              />
              <Button onClick={handleSaveKey} className="h-11 px-6">Save Key</Button>
            </div>
          </div>
        )}

        {/* LARGE SLIDERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
          {(Object.keys(paths) as (keyof PathPreferences)[]).map((key) => (
            <div key={key} className="group space-y-4 p-4 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{pathIcons[key]}</span>
                  <span className="font-display font-semibold text-lg capitalize tracking-wide">{key}</span>
                </div>
                <span className="text-xl font-bold tabular-nums text-primary">{paths[key]}%</span>
              </div>
              
              <div className="relative py-2">
                 <Slider
                  value={[paths[key]]}
                  onValueChange={(v) => handlePathChange(key, v)}
                  max={100}
                  min={0}
                  step={5}
                  className="cursor-pointer z-10"
                />
                <div 
                  className={`absolute bottom-0 left-0 h-1 rounded-full ${pathColors[key]} opacity-20 blur-sm transition-all`}
                  style={{ width: `${paths[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ENHANCED ACTION BUTTON */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full max-w-sm h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            variant="default"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Processing Bio-Data...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Generate My AI Transformation Path
              </>
            )}
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
            Proprietary Path Redistribution Logic Active
          </p>
        </div>
      </div>

      {/* RESULTS AREA: Large and Readable */}
      {(result || error) && (
        <div className="space-y-6 pb-20">
          {error && (
            <div className="flex items-center gap-3 p-6 rounded-2xl border border-destructive/50 bg-destructive/10 text-destructive animate-in fade-in">
              <AlertTriangle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
              <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center">
                <h4 className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Core Strategy Summary</h4>
                <p className="text-xl font-body leading-relaxed">{result.summary}</p>
                {result.timeline && (
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border text-sm font-semibold">
                    <span className="text-primary">⏱ Expected Timeline:</span> {result.timeline}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.diet && <LargeSection icon="🥗" title="Dietary Blueprint" content={result.diet} color="border-green-500/30" />}
                {result.exercise && <LargeSection icon="🏋️" title="Training Protocol" content={result.exercise} color="border-blue-500/30" />}
                {result.medical && <LargeSection icon="⚕️" title="Medical Oversight" content={result.medical} color="border-amber-500/30" />}
                {result.supplements && <LargeSection icon="💊" title="Supplement Stack" content={result.supplements} color="border-pink-500/30" />}
              </div>

              {result.disclaimer && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                   <p className="text-xs text-muted-foreground/80 italic text-center">
                    ⚠️ {result.disclaimer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ENHANCED CONTENT CARD */
const LargeSection = ({ icon, title, content, color }: { icon: string; title: string; content: string; color: string }) => (
  <div className={`p-6 rounded-2xl border ${color} bg-card hover:shadow-md transition-shadow space-y-4`}>
    <div className="flex items-center gap-3 pb-2 border-b border-border/50">
      <span className="text-xl">{icon}</span>
      <h4 className="font-display font-bold text-foreground tracking-wide">{title}</h4>
    </div>
    <div className="text-sm text-foreground/90 font-body leading-relaxed prose prose-sm max-w-none prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);

export default RecommendationPanel;