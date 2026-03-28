import { Upload, Sliders, Target, ShoppingBag } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Photo",
    description: "Share a photo of yourself — it stays completely private. No one else will ever see it.",
  },
  {
    icon: Sliders,
    title: "Customize Your Look",
    description: "Use our tools to visualize exactly what you want to change. Adjust anything from broad transformations to pinpoint details.",
  },
  {
    icon: Target,
    title: "Get Your Plan",
    description: "Choose your preferred path — diet, exercise, medical procedures, or any combination. We'll map out the percentages to reach your goal.",
  },
  {
    icon: ShoppingBag,
    title: "One-Click Access",
    description: "Purchase recommended products, supplements, or services directly through our platform with a single click.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-body font-medium">The Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            How Taylour Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-8 shadow-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                <step.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="absolute top-6 right-6 font-display text-5xl font-bold text-border/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
