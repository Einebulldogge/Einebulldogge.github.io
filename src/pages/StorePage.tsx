// src/pages/StorePage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Star, Zap, Activity, Brain, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Product Database
const PRODUCTS = [
  {
    id: 1,
    name: "Hyper-Pure Whey Isolate",
    category: "Nutrition",
    price: 49.99,
    rating: 4.9,
    reviews: 128,
    description: "Fast-absorbing protein to hit your 1.8g/kg target. Zero fillers, zero sugar.",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
    gradient: "from-yellow-500/20 to-orange-500/5",
  },
  {
    id: 2,
    name: "Magnesium Threonate",
    category: "Recovery",
    price: 34.00,
    rating: 4.8,
    reviews: 94,
    description: "Crosses the blood-brain barrier to enhance sleep architecture and CNS recovery.",
    icon: <Moon className="w-12 h-12 text-indigo-400" />,
    gradient: "from-indigo-500/20 to-blue-500/5",
  },
  {
    id: 3,
    name: "Zone 2 HR Chest Strap",
    category: "Tech",
    price: 79.99,
    rating: 5.0,
    reviews: 212,
    description: "Clinical-grade heart rate monitoring to ensure you stay exactly in Zone 2 during cardio.",
    icon: <Activity className="w-12 h-12 text-rose-500" />,
    gradient: "from-rose-500/20 to-red-500/5",
  },
  {
    id: 4,
    name: "Nootropic Focus Blend",
    category: "Performance",
    price: 55.00,
    rating: 4.7,
    reviews: 86,
    description: "Alpha-GPC and L-Theanine to keep you locked in during your fasting window.",
    icon: <Brain className="w-12 h-12 text-emerald-500" />,
    gradient: "from-emerald-500/20 to-teal-500/5",
  }
];

export default function StorePage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Nutrition", "Recovery", "Tech", "Performance"];

  const filteredProducts = filter === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* HEADER */}
      <header className="h-16 border-b border-border flex items-center px-6 gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link to="/studio" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Protocol</span>
        </Link>
        <div className="flex-1 text-center">
          <span className="font-display text-xl font-bold text-gradient-gold uppercase tracking-widest">Apothecary</span>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4 text-foreground" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12 space-y-12">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Optimize Your <span className="text-primary">Protocol</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Curated supplements and gear algorithmically matched to your modifAI Studio biometric goals.
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filter === cat 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,215,0,0.3)]" 
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
              
              {/* Product Image Area (Using Premium Gradients & Icons) */}
              <div className={`h-48 w-full bg-gradient-to-br ${product.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  {product.icon}
                </div>
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-foreground">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-lg leading-tight text-foreground">{product.name}</h3>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs font-bold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                  <Button size="sm" className="font-bold text-xs uppercase tracking-wider">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}