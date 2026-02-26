import { Link } from "react-router-dom"; // rebuild trigger
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowRight, Shield, Truck, Clock, Award, ChevronLeft, ChevronRight } from "lucide-react";
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

const testimonials = [
  {
    name: "Sarah M.",
    role: "Office Manager",
    rating: 5,
    text: "Ordered 12 custom stamps for our office. The quality is exceptional and they arrived in 2 days. Will absolutely reorder.",
  },
  {
    name: "David H.",
    role: "E-commerce Founder",
    rating: 5,
    text: "Our logo looks incredible. The wood handle feels super premium, and it makes branding our packaging boxes effortless.",
  },
  {
    name: "Linda K.",
    role: "Small Business Owner",
    rating: 5,
    text: "I've tried several stamp companies. SleekStamp is in a different league. Crisp impressions, fast shipping, great prices.",
  },
  {
    name: "Michael T.",
    role: "Wedding Planner",
    rating: 5,
    text: "Used these for custom wedding invitations. The fine details in the botanical design came out flawlessly. Highly recommend!",
  },
  {
    name: "Elena R.",
    role: "Ceramics Artist",
    rating: 5,
    text: "I use the stamp to brand my paper bags. The ink is rich, and the 6-inch size is perfect for maximum impact.",
  },
  {
    name: "Jenny S.",
    role: "Coffee Shop Owner",
    rating: 5,
    text: "Stamping hundreds of cups a day, and the impression is still as crisp as the first one. Huge money saver vs printing.",
  },
  {
    name: "Rachel B.",
    role: "Graphic Designer",
    rating: 5,
    text: "I order these for my clients' branding packages. They always look stunning and professional.",
  },
  {
    name: "Tom W.",
    role: "Restaurant Manager",
    rating: 5,
    text: "We use our stamp on every takeout bag. Looks way better than a sticker and is extremely cost-effective.",
  },
  {
    name: "Amanda C.",
    role: "Teacher",
    rating: 5,
    text: "Got a custom face stamp for grading papers. The kids love it! The ink is very consistent.",
  },
  {
    name: "Chris L.",
    role: "Photographer",
    rating: 5,
    text: "Perfect for stamping the back of my photo prints. The 4-inch stamp captures all my fine logo details perfectly.",
  },
  {
    name: "Jessica P.",
    role: "Boutique Owner",
    rating: 5,
    text: "A game changer for my custom packaging. Super fast turnaround and the wood quality is superb.",
  },
  {
    name: "Daniel F.",
    role: "Notary Public",
    rating: 5,
    text: "Crisp and clear every time. This is my go-to shop for notary and signature stamps.",
  },
  {
    name: "Emily W.",
    role: "Etsy Seller",
    rating: 5,
    text: "I was struggling with expensive custom boxes. Now I buy plain boxes and stamp my logo. Looks chic and saves a ton.",
  },
  {
    name: "Mark J.",
    role: "Gym Owner",
    rating: 5,
    text: "Got a massive 8-inch stamp for our promotional material. It's a beast and leaves an incredibly solid impression.",
  },
  {
    name: "Sophie N.",
    role: "Event Coordinator",
    rating: 5,
    text: "Used the custom stamps for event wristbands. Didn't smudge and looked super aesthetic.",
  }
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
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Premium custom stamps on desk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        <div className="relative container mx-auto px-4 py-20 flex justify-center">
          <div className="max-w-3xl w-full bg-[#1a2d47]/95 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-[2rem] shadow-2xl text-center animate-fade-in">
            <div className="inline-flex items-center justify-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-body font-medium tracking-wide">
                Premium Custom Stamps
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Custom Stamps
              <br />
              <span className="text-gold italic">Crafted for You</span>
            </h1>

            <p className="text-lg text-white/80 font-body mb-10 max-w-2xl mx-auto leading-relaxed">
              From self-inking business stamps to notary seals — precision-made, fast-shipped, and guaranteed to impress. Trusted by 45,000+ businesses.
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
              <div className="text-white/80 text-sm font-body flex items-center gap-2">
                <span className="text-blue-400 font-bold">✓</span> Free artwork setup
              </div>
              <div className="text-white/80 text-sm font-body flex items-center gap-2">
                <span className="text-blue-400 font-bold">✓</span> Free proof before printing
              </div>
              <div className="text-white/80 text-sm font-body flex items-center gap-2">
                <span className="text-blue-400 font-bold">✓</span> 100% satisfaction guarantee
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
              className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-2.5 rounded-lg font-body font-semibold text-sm hover:bg-foreground hover:text-white transition-smooth"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#f5f0e8] text-foreground border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Ordering a custom stamp has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
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
                <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-display font-bold text-lg text-white">
                  {step}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{desc}</p>
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
                {testimonials.map(({ name, role, rating, text }, index) => (
                  <div key={index} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 bg-card rounded-xl p-6 border border-border shadow-card flex flex-col justify-between">
                    <div>
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <p className="text-sm text-charcoal font-body leading-relaxed mb-4">"{text}"</p>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">{name}</p>
                      <p className="font-body text-xs text-muted-foreground">{role}</p>
                    </div>
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
