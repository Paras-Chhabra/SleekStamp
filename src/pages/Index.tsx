import { Link } from "react-router-dom"; // rebuild trigger
import { Star, ArrowRight, Shield, Truck, Clock, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useShopifyProducts } from "@/hooks/useShopify";
import heroBanner from "@/assets/hero-premium-stamps.png";

const trustBadges = [
  { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted" },
  { icon: Truck, label: "Free Shipping", sub: "Orders over $50" },
  { icon: Clock, label: "Fast Turnaround", sub: "1–3 business days" },
  { icon: Award, label: "Quality Guaranteed", sub: "100% satisfaction" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Office Manager",
    rating: 5,
    text: "Ordered 12 custom stamps for our office. The quality is exceptional and they arrived in 2 days. Will absolutely reorder.",
  },
  {
    name: "James T.",
    role: "Notary Public",
    rating: 5,
    text: "My notary stamp is perfect — exactly what I needed. The compliance team verified everything. Highly recommend.",
  },
  {
    name: "Linda K.",
    role: "Small Business Owner",
    rating: 5,
    text: "I've tried several stamp companies. SleekStamp is in a different league. Crisp impressions, fast shipping, great prices.",
  },
];

export default function Index() {
  const { data: products = [], isLoading } = useShopifyProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Premium custom stamps on desk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative container mx-auto px-4 py-20 flex justify-center">
          <div className="max-w-3xl w-full bg-navy/80 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[2rem] shadow-2xl text-center animate-fade-in">
            <div className="inline-flex items-center justify-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-body font-medium tracking-wide">
                Premium Custom Stamps
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Custom Stamps
              <br />
              <span className="text-gold">Crafted for You</span>
            </h1>

            <p className="text-lg text-primary-foreground/90 font-body mb-10 max-w-2xl mx-auto leading-relaxed">
              From self-inking business stamps to notary seals — precision-made, fast-shipped, and guaranteed to impress. Trusted by 50,000+ professionals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-8 py-4 rounded-xl font-body font-bold text-base hover:bg-gold-dark transition-smooth shadow-lg shadow-gold/20"
              >
                Shop All Stamps
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <div className="text-primary-foreground/90 text-sm font-body flex items-center gap-2">
                <span className="text-gold font-bold">✓</span> Free artwork setup
              </div>
              <div className="text-primary-foreground/90 text-sm font-body flex items-center gap-2">
                <span className="text-gold font-bold">✓</span> Free proof before printing
              </div>
              <div className="text-primary-foreground/90 text-sm font-body flex items-center gap-2">
                <span className="text-gold font-bold">✓</span> 100% satisfaction guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">{label}</p>
                  <p className="font-body text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-navy mb-3">Shop by Category</h2>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Find the perfect stamp for every need — from the office to the craft table.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group bg-card rounded-xl p-5 border border-border hover:border-gold/50 hover:shadow-hover transition-smooth text-center"
              >
                <div className="w-10 h-10 bg-navy rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-gold transition-smooth">
                  <span className="text-primary-foreground group-hover:text-accent-foreground font-display font-bold text-sm transition-smooth">
                    {cat.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-1 group-hover:text-navy transition-smooth">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground font-body leading-snug">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-navy mb-2">Best Sellers</h2>
              <p className="text-muted-foreground font-body">
                Our most popular stamps, loved by thousands.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-navy font-body font-semibold text-sm hover:text-gold transition-smooth"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-xl border border-border"></div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-navy text-navy px-6 py-2.5 rounded-lg font-body font-semibold text-sm hover:bg-navy hover:text-primary-foreground transition-smooth"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-primary-foreground/70 font-body max-w-md mx-auto">
              Ordering a custom stamp has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: "1", title: "Choose Your Stamp", desc: "Select the stamp type, size, and ink color that fits your needs." },
              { step: "2", title: "Upload Your Design", desc: "Upload your logo, text, or signature. We handle the artwork setup for free." },
              { step: "3", title: "Approve Your Proof", desc: "We send you a digital proof to review before we produce your stamp." },
              { step: "4", title: "Delivered Fast", desc: "Your stamp is produced and shipped within 1–3 business days." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+36px)] right-[calc(-50%+36px)] h-px bg-gold/30" />
                )}
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 font-display font-bold text-lg text-accent-foreground">
                  {step}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-primary-foreground/70 font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-navy mb-3">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">4.9 avg · 7,600+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-charcoal font-body leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">{name}</p>
                  <p className="font-body text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-slate-50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-navy mb-3">
            Ready to Create Your Custom Stamp?
          </h2>
          <p className="text-muted-foreground font-body mb-7 max-w-md mx-auto">
            Join over 50,000 satisfied customers. Free artwork setup. Free proof. Fast delivery.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-navy text-primary-foreground px-8 py-3.5 rounded-lg font-body font-semibold text-base hover:bg-navy-dark transition-smooth shadow-lg"
          >
            Browse All Stamps <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
