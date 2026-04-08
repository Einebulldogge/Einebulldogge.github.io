import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BiometricBody from "@/components/hero/BiometricBody";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-background font-body">
      {/* Subtle background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Biometric body — right side */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-full md:w-[55%] h-full">
          <BiometricBody />
        </div>
      </div>

      {/* Text content — left side */}
      <div className="container relative mx-auto px-6 z-20 flex">
        <div className="w-full md:w-[45%] space-y-8 mt-16 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="inline-flex gap-1">
              {[0.35, 0.6, 1].map((o, i) => (
                <span
                  key={i}
                  className="block w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ opacity: o }}
                />
              ))}
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
              Biometric Transformation Engine
            </p>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-foreground">
            Look the way <br />
            <span className="text-primary italic">you</span> want to.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            modifAI maps your body goals to a precise, personalised plan —
            combining AI‑powered insights across diet, training, and longevity
            protocols.
          </p>

          <div className="flex gap-4 pt-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.2)] px-8 py-6 text-sm uppercase tracking-widest font-bold"
              asChild
            >
              <Link to="/studio">Start Your Journey</Link>
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:border-primary/50 px-8 py-6 text-sm uppercase tracking-widest"
              asChild
            >
              <Link to="/store">Explore Apothecary</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
