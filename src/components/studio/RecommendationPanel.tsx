import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Key, X, Loader2, AlertTriangle } from "lucide-react";
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

    // Redistribute the difference among other paths proportionally
    const otherKeys = (Object.keys(paths) as (keyof PathPreferences)[]).filter((k) => k !== key);
    const otherTotal = otherKeys.reduce((sum, k) => sum + paths[k], 0);

    if (otherTotal === 0 && diff > 0) return; // can't take from zero

    const newPaths = { ...paths, [key]: newVal };
    otherKeys.forEach((k) => {
      const proportion = otherTotal > 0 ? paths[k] / otherTotal : 1 / otherKeys.length;
      newPaths[k] = Math.max(0, Math.round(paths[k] - diff * proportion));
    });

    // Ensure total is 100
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
          Path to Goal
        </h3>
        {keySet ? (
          <button
            onClick={handleRemoveKey}
            className="text-[10px] text-muted-foreground hover:text-destructive transition-colors font-body flex items-center gap-1"
          >
            <Key className="h-2.5 w-2.5" /> Change Key
          </button>
        ) : (
          <button
            onClick={() => setShowKeyInput(true)}
            className="text-[10px] text-primary hover:text-primary/80 transition-colors font-body flex items-center gap-1"
          >
            <Key className="h-2.5 w-2.5" /> Set API Key
          </button>
        )}
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/30 animate-fade-in">
          <p className="text-[10px] text-muted-foreground font-body">
            Enter your{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Gemini API key
            </a>{" "}
            (free tier available). Stored locally in your browser only.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="text-xs h-7"
              onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
            />
            <Button size="sm" onClick={handleSaveKey} className="h-7 text-xs px-2">
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowKeyInput(false)} className="h-7 text-xs px-1">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

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
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3 mr-1.5" />
            Get AI Recommendation
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg border border-destructive/30 bg-destructive/5 animate-fade-in">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-destructive font-body">{error}</p>
        </div>
      )}

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
