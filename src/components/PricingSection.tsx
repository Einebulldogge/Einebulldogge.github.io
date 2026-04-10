import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start transforming with broad customization tools.",
    features: [
      "Broad body changes & visualization",
      "Highly customizable tools",
      "Basic diet & exercise plans",
      "Progress tracking",
      "Full privacy protection",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month + excess usage",
    description: "Unlock precision tools and expert-level guidance.",
    features: [
      "Everything in Free",
      "Pinpoint exact small-scale changes",
      "Expert-level transformation tools",
      "Advanced medical guidance",
      "One-click product purchasing",
      "Hypothetical change previews",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    featured: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-body font-medium">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Your Transformation, Your Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col ${
                plan.featured
                  ? "border-primary/50 bg-card shadow-gold"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="mb-4 inline-block w-fit rounded-full bg-gradient-gold px-4 py-1 text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground font-body text-sm">/{plan.period}</span>
              </div>
              <p className="mt-3 text-muted-foreground font-body text-sm">{plan.description}</p>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80 font-body">
                    <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "hero" : "heroOutline"}
                size="lg"
                className="mt-8 w-full text-base"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
