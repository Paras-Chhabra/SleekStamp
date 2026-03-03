import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Check, ArrowRight, X, Recycle, Leaf, Zap, Package, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const HERO_GIF = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Sleekstamp.gif?v=1772023606";
const PRODUCT_VIDEO = "https://cdn.shopify.com/videos/c/o/v/a9b155bbf1314cc4a2e5b5d1b579f12a.mp4";
const VIDEO_POSTER = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Sleekstamp.gif?v=1772023606";
const BEFORE_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/beforeeeee.webp?v=1772516374";
const AFTER_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/afterr.webp?v=1772126309";

const REVIEW_IMAGES = [
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
            <section className="bg-white">
                <div className="container mx-auto px-4 pt-6 md:pt-10 pb-12 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-6">
                        🚀 Used by 2,000+ small businesses
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
                        Brand Every Package.<br />
                        <span className="text-red-600">Without the Printing Cost.</span>
                    </h1>
                    <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                        One custom stamp. Unlimited imprints on boxes, napkins,<br className="hidden sm:block" />
                        tissue paper, bags — anything. Pay once, stamp forever.
                    </p>

                    {/* Video */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <ProductVideo />
                    </div>

                    <Link
                        to="/customize"
                        className="inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] px-8 py-4 rounded-full font-body font-bold text-base transition-all duration-200 shadow-lg"
                    >
                        Order Your Custom Stamp <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="text-sm text-muted-foreground font-body mt-3">Takes less than 2 minutes</p>
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
                            <h2 className="font-display text-3xl font-bold text-foreground mb-3">{product.name}</h2>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="font-display text-3xl font-bold text-foreground">$59.99</span>
                                <span className="text-lg text-muted-foreground line-through font-body">$119.99</span>
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-body font-bold">SAVE 50%</span>
                            </div>

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

                            <p className="font-body text-foreground leading-relaxed mb-6">
                                Upload your logo or any design — our advanced engraving gives sharp, detailed impressions every time. Available in 4×4", 6×6", and 8×8".
                            </p>

                            <ul className="space-y-2 mb-8">
                                {["Upload any logo, art, or design", "Advanced laser engraving for sharp detail", "3 sizes: 4×4, 6×6, 8×8 inch", "Free preview before we dispatch"].map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 font-body text-sm">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/customize"
                                className="inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] px-8 py-4 rounded-full font-body font-bold text-base transition-all duration-200 shadow-lg"
                            >
                                Start Customizing <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section className="py-16 bg-white text-foreground border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold mb-3">How It Works</h2>
                        <p className="text-muted-foreground font-body max-w-md mx-auto">
                            Ordering a custom stamp has never been easier.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {[
                            { step: "1", title: "Choose your stamp size", desc: 'Pick 4", 6", or 8" inch stamp size that fits your need.' },
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

            {/* ═══ BEFORE / AFTER ═══ */}
            <section className="py-16 bg-white">
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
                            className="inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] px-8 py-4 rounded-full font-body font-bold text-base transition-all duration-200 shadow-lg"
                        >
                            Start Customizing <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ COMPARISON TABLE ═══ */}
            <section className="py-16 bg-white border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-xs text-gold font-body font-semibold uppercase tracking-widest mb-2">Why Choose a Stamp?</p>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Custom Stamp vs. Printed Packaging</h2>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto">See why thousands of small businesses choose stamps over costly printed packaging.</p>
                    </div>

                    <div className="max-w-3xl mx-auto overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 min-w-[480px]">
                            <div />
                            <div className="bg-navy rounded-t-2xl py-3 md:py-4 px-3 md:px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                    <Package className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                                    <span className="font-display font-bold text-white text-xs md:text-sm">Custom Stamp</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] text-green-400 font-body font-semibold uppercase tracking-wider">Recommended</span>
                            </div>
                            <div className="bg-gray-100 rounded-t-2xl py-3 md:py-4 px-3 md:px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                    <Recycle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                    <span className="font-display font-bold text-gray-500 text-xs md:text-sm">Printed Packaging</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {COMPARISON_ROWS.map(({ feature, stamp, printed, stampIcon, printedIcon }, i) => (
                            <div
                                key={feature}
                                className={`grid grid-cols-3 gap-2 md:gap-3 min-w-[480px] ${i < COMPARISON_ROWS.length - 1 ? "mb-2" : ""}`}
                            >
                                <div className="flex items-center px-3 md:px-4 py-3 md:py-4 bg-cream/40 rounded-xl">
                                    <span className="font-body font-semibold text-xs md:text-sm text-foreground">{feature}</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-3 md:py-4 bg-green-50 border border-green-100 rounded-xl">
                                    <span className="text-green-600 flex-shrink-0">{stampIcon}</span>
                                    <span className="font-body font-medium text-xs md:text-sm text-green-800">{stamp}</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-3 md:py-4 bg-red-50/60 border border-red-100/50 rounded-xl">
                                    <span className="text-red-400 flex-shrink-0">{printedIcon}</span>
                                    <span className="font-body text-xs md:text-sm text-red-400">{printed}</span>
                                </div>
                            </div>
                        ))}

                        {/* Bottom CTA row */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 mt-3 min-w-[480px]">
                            <div />
                            <div className="bg-navy rounded-b-2xl py-3 md:py-4 px-3 md:px-4 text-center">
                                <Link
                                    to="/customize"
                                    className="inline-flex items-center gap-1.5 bg-[#dc2626] text-white hover:bg-[#b91c1c] px-4 md:px-5 py-2 md:py-2.5 rounded-full font-body font-bold text-xs transition-all duration-200 shadow-md"
                                >
                                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <div className="bg-gray-100 rounded-b-2xl py-3 md:py-4 px-3 md:px-4 text-center">
                                <span className="text-xs text-gray-400 font-body">Expensive &amp; slow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ TRUSTED BY ═══ */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="p-10 md:p-14">
                        <h3 className="text-center font-display font-bold text-navy tracking-[0.2em] text-sm mb-12 opacity-80 uppercase">
                            Trusted By
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10">
                            <span className="font-body font-bold text-3xl text-navy">CraftNest</span>
                            <span className="font-serif font-bold text-4xl text-navy tracking-tight leading-none text-center">Bloom<br /><span className="text-sm font-sans tracking-widest uppercase opacity-70">Goods</span></span>
                            <span className="font-serif text-3xl text-navy">Urban Maker</span>
                            <span className="font-serif text-3xl text-navy">Parcel &amp; Print</span>
                            <span className="font-serif font-medium text-3xl text-navy">Studio Supply Co.</span>
                            <span className="font-serif text-3xl text-navy">Little Batch Co.</span>
                            <span className="font-display font-bold text-4xl text-navy">Box &amp; Grain</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ READY TO BRAND ═══ */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to Brand Your Packaging?</h2>
                    <p className="font-body text-muted-foreground mb-8">Configure your custom stamp in under 2 minutes.</p>
                    <Link
                        to="/customize"
                        className="inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] px-8 py-4 rounded-full font-body font-bold text-base transition-all duration-200 shadow-lg"
                    >
                        Order Now — From $49 <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* ═══ CUSTOMER REVIEWS ═══ */}
            <ReviewsSection />

            <Footer />

            {/* ═══ STICKY ORDER NOW BUTTON ═══ */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/90 backdrop-blur border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                <Link
                    to="/customize"
                    className="flex items-center justify-center gap-2 w-full bg-[#dc2626] text-white hover:bg-[#b91c1c] py-4 rounded-full font-body font-bold text-base transition-all duration-200 shadow-lg"
                >
                    Order Now <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT VIDEO — autoplay on scroll into view
   ═══════════════════════════════════════════════════════════════════════ */

function ProductVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { /* browser blocked autoplay */ });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-border bg-black">
            <video
                ref={videoRef}
                src={PRODUCT_VIDEO}
                poster={VIDEO_POSTER}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />
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
        <section className="py-16 bg-white border-t border-border">
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
