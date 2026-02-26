import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Check, ArrowRight, X, Recycle, Leaf, Zap, Package, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const HERO_GIF = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Sleekstamp.gif?v=1772023606";
const BEFORE_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/beforee.webp?v=1772126305";
const AFTER_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/afterr.webp?v=1772126309";

const REVIEW_IMAGES = [
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_005857.webp?v=1772134436",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_005901.webp?v=1772134586",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_005857_1.webp?v=1772134430",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_005911.webp?v=1772134423",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_005915.webp?v=1772134418",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003815.webp?v=1772133740",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003947.webp?v=1772133706",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003843.webp?v=1772133713",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003839.webp?v=1772133719",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003723.webp?v=1772133730",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003731.webp?v=1772133735",
    "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Screenshot_2026-02-27_003815.webp?v=1772133740",
];

const COMPARISON_ROWS = [
    { feature: "Cost", stamp: "One-time cost", printed: "Reorder every time", stampIcon: <Check className="w-4 h-4" />, printedIcon: <X className="w-4 h-4" /> },
    { feature: "Flexibility", stamp: "Flexible", printed: "Bulk only", stampIcon: <RefreshCw className="w-4 h-4" />, printedIcon: <X className="w-4 h-4" /> },
    { feature: "Environment", stamp: "Eco-friendly", printed: "Wasteful", stampIcon: <Leaf className="w-4 h-4" />, printedIcon: <X className="w-4 h-4" /> },
    { feature: "Speed", stamp: "Fast turnaround", printed: "Long lead time", stampIcon: <Zap className="w-4 h-4" />, printedIcon: <X className="w-4 h-4" /> },
];

export default function StampBuilder() {
    const { data, isLoading } = useShopifyProducts();
    const products = data?.display ?? [];

    const product = products.find((p) => p.slug === "big-custom-stamps-by-sleekstamp") ?? products.find((p) => p.category === "custom-stamps");

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="font-body text-muted-foreground">Product not found. Please try again later.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* ═══ HERO ═══ */}
            <section className="relative overflow-hidden bg-navy">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                                Brand Every Package.<br />
                                <span className="text-gold">Without the Printing Cost.</span>
                            </h1>
                            <p className="font-body text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                                Create one custom stamp and brand thousands of packages — without recurring printing expenses.
                            </p>
                            <Link
                                to="/customize"
                                className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                            >
                                Build Your Custom Stamp <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="text-white/40 text-sm font-body mt-3">Takes less than 2 minutes</p>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <img src={HERO_GIF} alt="SleekStamp demo" className="w-full h-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PRODUCT INFO ═══ */}
            <section className="py-16 bg-white border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image */}
                        <div className="aspect-square bg-cream rounded-2xl overflow-hidden border border-border shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div>
                            <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">Custom Stamps</p>
                            <h2 className="font-display text-3xl font-bold text-foreground mb-3">{product.name}</h2>

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="font-display text-2xl font-bold text-gold">
                                        ${Math.min(...product.sizes.map((s) => s.price)).toFixed(2)}
                                    </span>
                                    <span className="text-muted-foreground font-body">—</span>
                                    <span className="font-display text-2xl font-bold text-gold">
                                        ${Math.max(...product.sizes.map((s) => s.price)).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground font-body">
                                    {product.rating} · {product.reviewCount.toLocaleString()} reviews
                                </span>
                            </div>

                            <p className="font-body text-foreground leading-relaxed mb-6">{product.description}</p>

                            {product.features && product.features.length > 0 && (
                                <ul className="space-y-2 mb-8">
                                    {product.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 font-body text-sm">
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {product.sizes && (
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => (
                                        <span key={s.label} className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-body font-medium border border-green-200">
                                            ✓ {s.label} available
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Link
                                to="/customize"
                                className="mt-8 inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                            >
                                Start Customizing <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ BEFORE / AFTER ═══ */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
                            <img src={BEFORE_IMG} alt="Before — Just Packaging" className="w-full aspect-[4/3] object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <span className="text-white font-display font-bold text-lg">Before — Just Packaging</span>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
                            <img src={AFTER_IMG} alt="After — A Brand Statement" className="w-full aspect-[4/3] object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <span className="text-white font-display font-bold text-lg">After — A Brand Statement</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="font-display text-3xl font-bold mb-3">The Difference Is in the Details.</h2>
                        <p className="text-muted-foreground font-body mb-6">
                            Stamp your logo on boxes, bags, napkins, notebooks, and more — instantly elevate every order.
                        </p>
                        <Link
                            to="/customize"
                            className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                        >
                            Start Customizing <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ COMPARISON TABLE ═══ */}
            <section className="py-16 bg-slate-50 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-xs text-gold font-body font-semibold uppercase tracking-widest mb-2">Why Choose a Stamp?</p>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Custom Stamp vs. Printed Packaging</h2>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto">See why thousands of small businesses choose stamps over costly printed packaging.</p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div />
                            <div className="bg-navy rounded-t-2xl py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Package className="w-5 h-5 text-gold" />
                                    <span className="font-display font-bold text-white text-sm">Custom Stamp</span>
                                </div>
                                <span className="text-[10px] text-green-400 font-body font-semibold uppercase tracking-wider">Recommended</span>
                            </div>
                            <div className="bg-gray-100 rounded-t-2xl py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Recycle className="w-5 h-5 text-gray-400" />
                                    <span className="font-display font-bold text-gray-500 text-sm">Printed Packaging</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {COMPARISON_ROWS.map(({ feature, stamp, printed, stampIcon, printedIcon }, i) => (
                            <div
                                key={feature}
                                className={`grid grid-cols-3 gap-3 ${i < COMPARISON_ROWS.length - 1 ? "mb-2" : ""}`}
                            >
                                <div className="flex items-center px-4 py-4 bg-cream/40 rounded-xl">
                                    <span className="font-body font-semibold text-sm text-foreground">{feature}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-4 bg-green-50 border border-green-100 rounded-xl">
                                    <span className="text-green-600 flex-shrink-0">{stampIcon}</span>
                                    <span className="font-body font-medium text-sm text-green-800">{stamp}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-4 bg-red-50/60 border border-red-100/50 rounded-xl">
                                    <span className="text-red-400 flex-shrink-0">{printedIcon}</span>
                                    <span className="font-body text-sm text-red-400">{printed}</span>
                                </div>
                            </div>
                        ))}

                        {/* Bottom CTA row */}
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <div />
                            <div className="bg-navy rounded-b-2xl py-4 px-4 text-center">
                                <Link
                                    to="/customize"
                                    className="inline-flex items-center gap-1.5 bg-gold text-navy px-5 py-2.5 rounded-xl font-body font-bold text-xs hover:bg-gold-dark transition-all duration-200 shadow-md"
                                >
                                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="bg-gray-100 rounded-b-2xl py-4 px-4 text-center">
                                <span className="text-xs text-gray-400 font-body">Expensive & slow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CUSTOMER REVIEWS ═══ */}
            <ReviewsSection />

            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVIEWS SECTION
   ═══════════════════════════════════════════════════════════════════════ */

function ReviewsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 320;
        scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="py-16 bg-background border-t border-border">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <p className="text-xs text-gold font-body font-semibold uppercase tracking-widest mb-2">Real Customers, Real Results</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
                    <p className="text-muted-foreground font-body max-w-lg mx-auto">Join thousands of happy small business owners who trust SleekStamp.</p>
                </div>

                <div className="relative">
                    {/* Scroll arrows */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center hover:bg-cream transition-smooth hidden md:flex"
                    >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center hover:bg-cream transition-smooth hidden md:flex"
                    >
                        <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Scrollable track */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory no-scrollbar"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {REVIEW_IMAGES.map((src, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start rounded-2xl overflow-hidden border border-border shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
                            >
                                <img
                                    src={src}
                                    alt={`Customer review ${i + 1}`}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
