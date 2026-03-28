import { Shield, Eye, Sparkles, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Total Privacy",
    description: "Your picture is your picture. No one else has access to it. The only thing anyone sees is the progress you've made in real life.",
  },
  {
    icon: Sparkles,
    title: "Personalized Guidance",
    description: "We tell you exactly how to achieve your look — from diet and exercise percentages to medical procedures and supplements.",
  },
  {
    icon: Eye,
    title: "Visual Transformation",
    description: "See a realistic preview of your transformation before you start. Know exactly what you're working toward.",
  },
  {
    icon: BarChart3,
    title: "Track Real Progress",
    description: "Monitor your real-life changes over time. Your transformation journey is documented and celebrated — by you alone.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-body font-medium">Why Taylour</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Built Around <span className="text-gradient-gold italic">You</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-5 rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
