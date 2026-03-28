import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Body transformation visualization"
          className="w-full h-full object-cover opacity-40"
          width={1280}
          height={720}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="max-w-2xl space-y-8">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-body font-medium">
            Your Transformation Starts Here
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-foreground">
            Look the way{" "}
            <span className="text-gradient-gold italic">you</span>{" "}
            want to
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg font-body">
            Our platform shows you how to achieve your ideal look through personalized plans — 
            combining diet, exercise, and medical guidance tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" className="text-base px-10" asChild>
              <Link to="/studio">Start Your Journey</Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-10" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
