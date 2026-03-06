import { Link } from "react-router-dom"; // rebuild trigger
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowRight, Shield, Truck, Clock, Award, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useShopifyProducts } from "@/hooks/useShopify";
import heroBanner from "@/assets/hero-premium-stamps.png";

const trustBadges = [
  { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted" },
  { icon: Truck, label: "Free Shipping", sub: "Orders over $150" },
  { icon: Clock, label: "Fast Turnaround", sub: "1–3 business days" },
  { icon: Award, label: "Quality Guaranteed", sub: "100% satisfaction" },
];

const HOMEPAGE_REVIEW_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/1.webp?v=1772533083",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/2.webp?v=1772533093",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/3.webp?v=1772533100",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/4.webp?v=1772533108",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/5.webp?v=1772533114",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/6.webp?v=1772533119",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/7.webp?v=1772533125",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/8.webp?v=1772533132",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/9.webp?v=1772533137",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/11.webp?v=1772533150",
];

const worksOnImages = [
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_45_40_PM.webp?v=1772102150",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_44_18_PM.webp?v=1772102133",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_42_03_PM.webp?v=1772102125",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_40_33_PM.webp?v=1772102120",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_46_43_PM.webp?v=1772102114",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_48_19_PM.webp?v=1772102092",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_49_15_PM.webp?v=1772102080",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_50_30_PM.webp?v=1772102064",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_51_22_PM.webp?v=1772101965",
  "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/ChatGPT_Image_Feb_26_2026_03_52_20_PM.webp?v=1772101944"
];

export default function Index() {
  const { data, isLoading } = useShopifyProducts();
  const products = data?.display ?? [];
  const featuredProducts = products.slice(0, 4);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100svh] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Premium custom stamps on desk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-20 flex justify-center">
          <div className="max-w-3xl w-full bg-[#f6f5f3] backdrop-blur-md p-6 md:p-14 rounded-[2rem] shadow-2xl text-center animate-fade-in border border-black/5">
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center border-2 border-[#Cca35a] text-[#Cca35a] rounded-full px-4 py-1 mb-5 md:px-6 md:py-1.5 md:mb-8 bg-transparent">
              <span className="text-xs md:text-sm font-body font-bold tracking-wide">
                Premium Custom Stamps
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-[#1c1c1c] leading-tight mb-3 md:mb-5 tracking-tight">
              Custom Stamps
              <br />
              <span className="text-[#Cca35a] italic font-serif tracking-normal">Crafted for You</span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg text-[#333333] font-body mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              One custom stamp. Unlimited imprints on boxes, napkins, tissue paper,
              <br className="hidden md:block" />
              — anything. Pay once, stamp forever. Trusted by 45,000+ businesses.
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 md:mb-10">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-body font-bold text-sm md:text-base hover:bg-[#2b2b2b] transition-smooth shadow-lg"
              >
                Shop All Stamps
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>

            {/* Bottom Checks */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-3">
              <div className="text-[#333333] text-xs md:text-sm font-body font-medium flex items-center gap-1.5 md:gap-2">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#Cca35a]" /> Free artwork setup
              </div>
              <div className="text-[#333333] text-xs md:text-sm font-body font-medium flex items-center gap-1.5 md:gap-2">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#Cca35a]" /> Free proof before printing
              </div>
              <div className="text-[#333333] text-xs md:text-sm font-body font-medium flex items-center gap-1.5 md:gap-2">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#Cca35a]" /> 100% satisfaction guarantee
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
                <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
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
              Shop precision-crafted stamps for business, personal, and creative needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group bg-card rounded-xl p-5 border border-border hover:border-gold/50 hover:shadow-hover transition-smooth text-center"
              >
                <div className="w-10 h-10 bg-navy rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-[#Cca35a] transition-smooth">
                  <span className="text-white font-display font-bold text-sm transition-smooth">
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
              className="hidden sm:inline-flex items-center gap-1.5 text-foreground font-body font-semibold text-sm hover:underline transition-smooth"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#e8e8e8] animate-pulse rounded-xl border border-border"></div>
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
              className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-2.5 rounded-lg font-body font-semibold text-sm hover:bg-foreground hover:text-white transition-smooth"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-24 bg-[#f5f0e8] text-foreground border-y border-border min-h-[100svh] md:min-h-0 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 md:mb-3">How It Works</h2>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-md mx-auto">
              Ordering a custom stamp has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 relative">
            {[
              { step: "1", title: "Choose your stamp size", desc: "Pick 4\", 6\", or 8\" inch stamp size that fits your need." },
              { step: "2", title: "Upload Your Design", desc: "Upload your logo, text, or signature. We handle the artwork setup for free." },
              { step: "3", title: "Approve Your Proof", desc: "We send you a digital proof to review before we dispatch your stamp." },
              { step: "4", title: "Delivered Fast", desc: "Your stamp is produced and shipped within 1–3 business days." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+36px)] right-[calc(-50%+36px)] h-px bg-border" />
                )}
                <div className="w-10 h-10 md:w-12 md:h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 font-display font-bold text-base md:text-lg text-white">
                  {step}
                </div>
                <h3 className="font-display font-semibold text-sm md:text-base mb-1 md:mb-2">{title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works on Everything */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">Works on everything</h2>
            <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
              One stamp. Endless possibilities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {worksOnImages.map((src, i) => (
              <div key={i} className="aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                <img src={src} alt={`Stamp application ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
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

          <div className="relative">
            <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-8 -mx-4 px-4 sm:mx-0 sm:px-0" ref={emblaRef}>
              <div className="flex gap-6">
                {HOMEPAGE_REVIEW_IMAGES.map((src, index) => (
                  <div key={index} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                    <img
                      src={src}
                      alt={`Customer review ${index + 1}`}
                      className="w-full rounded-xl border border-border shadow-card object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md border border-border flex items-center justify-center text-navy hover:bg-cream transition-smooth hidden sm:flex"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md border border-border flex items-center justify-center text-navy hover:bg-cream transition-smooth hidden sm:flex"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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
            Join over 45,000+ satisfied customers. Free artwork setup. Free proof. Fast delivery.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-3.5 rounded-lg font-body font-semibold text-base hover:bg-foreground/90 transition-smooth shadow-lg"
          >
            Browse All Stamps <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
