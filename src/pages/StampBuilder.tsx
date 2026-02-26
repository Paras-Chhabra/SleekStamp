import { useState, useRef, useEffect, useCallback } from "react";
import { useShopifyProducts } from "@/hooks/useShopify";
import { createShopifyCheckout } from "@/utils/shopify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, ChevronRight, Upload, Check, ArrowRight, ArrowLeft, Zap, Palette, Box, Eye } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface Variant {
    id: string;
    title: string;
    price: number;
    available: boolean;
}

interface StampPadOption {
    name: string;
    price: number;
    variantId: string;
}

interface BuilderSelections {
    variant: Variant | null;
    logoFile: File | null;
    logoPreview: string | null;
    stampPad: StampPadOption | null;
    inkColor: string;
    priorityProcessing: boolean;
    priorityVariantId: string | null;
    priorityPrice: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const STEP_LABELS = ["Size", "Logo", "Pad", "Ink", "Speed", "Review"];

const INK_COLORS: { name: string; hex: string }[] = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "Blue", hex: "#1e40af" },
    { name: "Red", hex: "#dc2626" },
    { name: "Green", hex: "#16a34a" },
    { name: "Purple", hex: "#7c3aed" },
];

const HERO_GIF = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/Sleekstamp.gif?v=1772023606";
const BEFORE_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/beforee.webp?v=1772126305";
const AFTER_IMG = "https://cdn.shopify.com/s/files/1/0676/7401/3807/files/afterr.webp?v=1772126309";

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════ */

function ProgressBar({ step, onStepClick }: { step: number; onStepClick: (s: number) => void }) {
    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto py-4 px-2">
            {STEP_LABELS.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                    <button
                        key={label}
                        onClick={() => i < step && onStepClick(i)}
                        className={`flex flex-col items-center gap-1.5 transition-all ${i < step ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${done ? "bg-green-500 text-white" : active ? "bg-gold text-white ring-4 ring-gold/20" : "bg-gray-200 text-gray-500"}`}
                        >
                            {done ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[11px] font-body font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1 — SIZE
   ═══════════════════════════════════════════════════════════════════════ */

function StepSize({ variants, selected, onSelect }: { variants: Variant[]; selected: Variant | null; onSelect: (v: Variant) => void }) {
    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Select Your Stamp Size</h2>
            <p className="text-muted-foreground font-body mb-8">Choose the size that fits your branding needs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {variants.map((v) => {
                    const active = selected?.id === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => onSelect(v)}
                            disabled={!v.available}
                            className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-200
                ${active ? "border-gold bg-gold/5 shadow-lg scale-[1.02]" : "border-border bg-white hover:border-gold/40 hover:shadow-md"}
                ${!v.available ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            {active && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                            )}
                            <div className="font-display font-bold text-lg mb-1">{v.title}</div>
                            <div className="text-2xl font-bold text-gold font-body">${v.price.toFixed(2)}</div>
                            {!v.available && <div className="text-xs text-red-500 mt-1">Out of stock</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 2 — LOGO
   ═══════════════════════════════════════════════════════════════════════ */

function StepLogo({
    logoFile,
    logoPreview,
    onUpload,
    onRemove,
}: {
    logoFile: File | null;
    logoPreview: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) onUpload(file);
        },
        [onUpload]
    );

    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Upload Your Design</h2>
            <p className="text-muted-foreground font-body mb-8">
                Upload your logo, artwork, or signature. We accept PNG, JPG, PDF, AI, and EPS files.
            </p>

            {logoPreview ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center">
                    <img src={logoPreview} alt="Logo preview" className="max-h-48 mx-auto rounded-xl mb-4 shadow-sm" />
                    <p className="text-sm font-body text-muted-foreground mb-3">{logoFile?.name}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 rounded-xl border border-border bg-white text-sm font-body font-medium hover:bg-cream transition-smooth"
                        >
                            Replace
                        </button>
                        <button
                            onClick={onRemove}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 text-sm font-body font-medium hover:bg-red-100 transition-smooth"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
            ${dragOver ? "border-gold bg-gold/5 scale-[1.01]" : "border-border bg-white hover:border-gold/40"}`}
                >
                    <Upload className="w-10 h-10 text-gold mx-auto mb-4" />
                    <p className="font-body font-semibold text-foreground mb-1">
                        Drag & drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                        or <span className="text-gold font-medium">click to browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground font-body mt-3">
                        Accepted: PNG, JPG, PDF, AI, EPS
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf,.ai,.eps"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                }}
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 3 — STAMP PAD
   ═══════════════════════════════════════════════════════════════════════ */

function StepPad({
    options,
    selected,
    onToggle,
}: {
    options: StampPadOption[];
    selected: StampPadOption | null;
    onToggle: (opt: StampPadOption | null) => void;
}) {
    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Add a Stamp Pad?</h2>
            <p className="text-muted-foreground font-body mb-8">Optional — get a matching ink pad for crisp impressions.</p>

            <div className="space-y-3">
                {/* No pad option */}
                <button
                    onClick={() => onToggle(null)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
            ${!selected ? "border-gold bg-gold/5" : "border-border bg-white hover:border-gold/40"}`}
                >
                    <span className="font-body font-medium">No stamp pad needed</span>
                    <span className="font-body text-sm text-muted-foreground">$0.00</span>
                </button>

                {options.map((opt) => {
                    const active = selected?.variantId === opt.variantId;
                    return (
                        <button
                            key={opt.variantId}
                            onClick={() => onToggle(opt)}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
                ${active ? "border-gold bg-gold/5" : "border-border bg-white hover:border-gold/40"}`}
                        >
                            <div className="text-left">
                                <span className="font-body font-medium block">{opt.name}</span>
                            </div>
                            <span className="font-body font-bold text-gold">+${opt.price.toFixed(2)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 4 — INK COLOR
   ═══════════════════════════════════════════════════════════════════════ */

function StepInk({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Choose Ink Color</h2>
            <p className="text-muted-foreground font-body mb-8">Select the ink color for your stamp impression.</p>

            <div className="flex flex-wrap gap-4">
                {INK_COLORS.map(({ name, hex }) => {
                    const active = selected === name;
                    return (
                        <button
                            key={name}
                            onClick={() => onSelect(name)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-full border-2 transition-all duration-200
                ${active ? "border-gold bg-gold/5 shadow-md" : "border-border bg-white hover:border-gold/40"}`}
                        >
                            <div className="w-6 h-6 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: hex }} />
                            <span className="font-body font-medium text-sm">{name}</span>
                            {active && <Check className="w-4 h-4 text-gold" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 5 — PRIORITY PROCESSING
   ═══════════════════════════════════════════════════════════════════════ */

function StepSpeed({
    selected,
    price,
    onToggle,
}: {
    selected: boolean;
    price: number;
    onToggle: () => void;
}) {
    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Priority Processing</h2>
            <p className="text-muted-foreground font-body mb-8">Want your stamp made and shipped faster? Skip the queue!</p>

            <div className="space-y-3">
                <button
                    onClick={() => selected && onToggle()}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
            ${!selected ? "border-gold bg-gold/5" : "border-border bg-white hover:border-gold/40"}`}
                >
                    <div className="text-left">
                        <span className="font-body font-medium block">Standard Processing</span>
                        <span className="text-xs text-muted-foreground font-body">Ships in 1–3 business days</span>
                    </div>
                    <span className="font-body text-sm text-muted-foreground">Included</span>
                </button>

                <button
                    onClick={() => !selected && onToggle()}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
            ${selected ? "border-gold bg-gold/5" : "border-border bg-white hover:border-gold/40"}`}
                >
                    <div className="text-left flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <div>
                            <span className="font-body font-medium block">Priority Processing</span>
                            <span className="text-xs text-muted-foreground font-body">Ships within 24 hours</span>
                        </div>
                    </div>
                    <span className="font-body font-bold text-gold">+${price.toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 6 — REVIEW
   ═══════════════════════════════════════════════════════════════════════ */

function StepReview({
    selections,
    totalPrice,
    onEdit,
    onCheckout,
    isSubmitting,
}: {
    selections: BuilderSelections;
    totalPrice: number;
    onEdit: (step: number) => void;
    onCheckout: () => void;
    isSubmitting: boolean;
}) {
    const rows = [
        { label: "Stamp Size", value: selections.variant?.title ?? "—", price: selections.variant?.price ?? 0, step: 0 },
        { label: "Your Design", value: selections.logoFile?.name ?? "No file uploaded", price: 0, step: 1 },
        { label: "Stamp Pad", value: selections.stampPad ? selections.stampPad.name : "None", price: selections.stampPad?.price ?? 0, step: 2 },
        { label: "Ink Color", value: selections.inkColor, price: 0, step: 3 },
        { label: "Processing", value: selections.priorityProcessing ? "Priority (24h)" : "Standard (1–3 days)", price: selections.priorityProcessing ? selections.priorityPrice : 0, step: 4 },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">Review Your Order</h2>
            <p className="text-muted-foreground font-body mb-8">Make sure everything looks perfect before checkout.</p>

            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                {rows.map(({ label, value, price, step }, i) => (
                    <div
                        key={label}
                        className={`flex items-center justify-between px-5 py-4 ${i < rows.length - 1 ? "border-b border-border" : ""}`}
                    >
                        <div className="flex-1">
                            <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">{label}</div>
                            <div className="font-body font-medium text-sm">{value}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            {price > 0 && <span className="font-body font-bold text-sm">${price.toFixed(2)}</span>}
                            <button onClick={() => onEdit(step)} className="text-xs text-gold font-body font-medium hover:underline">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}

                {/* Logo preview */}
                {selections.logoPreview && (
                    <div className="p-5 border-t border-border bg-gray-50 flex items-center gap-4">
                        <img src={selections.logoPreview} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border bg-white p-1" />
                        <span className="text-sm font-body text-muted-foreground">Your uploaded design</span>
                    </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between px-5 py-5 bg-navy text-white">
                    <span className="font-display font-bold text-lg">Total</span>
                    <span className="font-display font-bold text-2xl">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={isSubmitting || !selections.variant}
                className="mt-6 w-full bg-gold text-navy py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Creating Checkout…
                    </span>
                ) : (
                    <>
                        <ArrowRight className="w-5 h-5" /> Add to Cart & Checkout — ${totalPrice.toFixed(2)}
                    </>
                )}
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export default function StampBuilder() {
    const { data, isLoading } = useShopifyProducts();
    const products = data?.display ?? [];
    const allProducts = data?.all ?? [];

    // Find the big custom stamp product
    const product = products.find((p) => p.slug === "big-custom-stamps-by-sleekstamp") ?? products.find((p) => p.category === "custom-stamps");

    // Find add-on products
    const stampPadProducts = allProducts.filter((p) => p.category === "stamp-pad");
    const priorityProduct = allProducts.find((p) => p.name.toLowerCase().includes("priority processing"));

    const stampPadOptions: StampPadOption[] = stampPadProducts
        .sort((a, b) => a.price - b.price)
        .map((p) => ({ name: p.name, price: p.price, variantId: p.defaultVariantId ?? "" }));

    const priorityPrice = priorityProduct?.price ?? 4.99;

    // Builder state
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<BuilderSelections>({
        variant: null,
        logoFile: null,
        logoPreview: null,
        stampPad: null,
        inkColor: "Black",
        priorityProcessing: false,
        priorityVariantId: priorityProduct?.defaultVariantId ?? null,
        priorityPrice,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const builderRef = useRef<HTMLDivElement>(null);

    // Extract variants
    const variants: Variant[] = (product?.sizes ?? []).map((s) => ({
        id: s.variantId ?? "",
        title: s.label,
        price: s.price,
        available: true,
    }));

    // Total price computation
    const totalPrice =
        (selections.variant?.price ?? 0) +
        (selections.stampPad?.price ?? 0) +
        (selections.priorityProcessing ? priorityPrice : 0);

    // Step validation
    const canContinue = () => {
        switch (step) {
            case 0: return !!selections.variant;
            case 1: return !!selections.logoFile;
            case 2: return true; // optional
            case 3: return !!selections.inkColor;
            case 4: return true; // optional
            default: return true;
        }
    };

    const scrollToBuilder = () => {
        builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Checkout handler
    const handleCheckout = async () => {
        if (!selections.variant) return;
        setIsSubmitting(true);

        try {
            const lineItems: any[] = [];

            // Base product
            const attributes: { key: string; value: string }[] = [];
            attributes.push({ key: "Ink Color", value: selections.inkColor });
            if (selections.logoFile) {
                attributes.push({ key: "Uploaded Logo", value: selections.logoFile.name });
            }

            lineItems.push({
                variantId: selections.variant.id,
                quantity: 1,
                stampPad: selections.stampPad?.name,
                priorityProcessing: selections.priorityProcessing,
                logo: selections.logoFile?.name ?? null,
            });

            // Stamp pad
            if (selections.stampPad) {
                lineItems.push({
                    variantId: selections.stampPad.variantId,
                    quantity: 1,
                });
            }

            // Priority processing
            if (selections.priorityProcessing && priorityProduct?.defaultVariantId) {
                lineItems.push({
                    variantId: priorityProduct.defaultVariantId,
                    quantity: 1,
                });
            }

            const checkoutUrl = await createShopifyCheckout(lineItems);
            window.location.href = checkoutUrl;
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to create checkout. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Loading state
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
                            <button
                                onClick={scrollToBuilder}
                                className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                            >
                                Build Your Custom Stamp <ArrowRight className="w-5 h-5" />
                            </button>
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

                            {/* Price range */}
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

                            {/* Rating */}
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

                            {/* Features */}
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

                            {/* Variant availability */}
                            {product.sizes && (
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => (
                                        <span key={s.label} className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-body font-medium border border-green-200">
                                            ✓ {s.label} available
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={scrollToBuilder}
                                className="mt-8 inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                            >
                                Start Customizing <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ BEFORE / AFTER ═══ */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm group">
                            <img src={BEFORE_IMG} alt="Before — Just Packaging" className="w-full aspect-[4/3] object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <span className="text-white font-display font-bold text-lg">Before — Just Packaging</span>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm group">
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
                        <button
                            onClick={scrollToBuilder}
                            className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-2xl font-body font-bold text-base hover:bg-gold-dark transition-all duration-200 shadow-lg"
                        >
                            Start Customizing <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ MULTI-STEP BUILDER ═══ */}
            <section ref={builderRef} className="py-16 bg-white border-t border-border" id="builder">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="font-display text-3xl font-bold mb-2">Build Your Custom Stamp</h2>
                        <p className="text-muted-foreground font-body">Complete each step to customize your stamp.</p>
                    </div>

                    {/* Sticky progress bar */}
                    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border -mx-4 px-4 mb-8 shadow-sm">
                        <ProgressBar step={step} onStepClick={(s) => setStep(s)} />

                        {/* Floating total — desktop */}
                        {selections.variant && (
                            <div className="hidden md:flex items-center justify-end pb-3 gap-2">
                                <span className="text-sm text-muted-foreground font-body">Live Total:</span>
                                <span className="font-display font-bold text-xl text-gold">${totalPrice.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Step content */}
                    <div className="max-w-2xl mx-auto min-h-[320px]">
                        {step === 0 && (
                            <StepSize
                                variants={variants}
                                selected={selections.variant}
                                onSelect={(v) => setSelections((s) => ({ ...s, variant: v }))}
                            />
                        )}
                        {step === 1 && (
                            <StepLogo
                                logoFile={selections.logoFile}
                                logoPreview={selections.logoPreview}
                                onUpload={(file) => {
                                    const preview = URL.createObjectURL(file);
                                    setSelections((s) => ({ ...s, logoFile: file, logoPreview: preview }));
                                }}
                                onRemove={() => setSelections((s) => ({ ...s, logoFile: null, logoPreview: null }))}
                            />
                        )}
                        {step === 2 && (
                            <StepPad
                                options={stampPadOptions}
                                selected={selections.stampPad}
                                onToggle={(opt) => setSelections((s) => ({ ...s, stampPad: opt }))}
                            />
                        )}
                        {step === 3 && (
                            <StepInk
                                selected={selections.inkColor}
                                onSelect={(c) => setSelections((s) => ({ ...s, inkColor: c }))}
                            />
                        )}
                        {step === 4 && (
                            <StepSpeed
                                selected={selections.priorityProcessing}
                                price={priorityPrice}
                                onToggle={() => setSelections((s) => ({ ...s, priorityProcessing: !s.priorityProcessing }))}
                            />
                        )}
                        {step === 5 && (
                            <StepReview
                                selections={selections}
                                totalPrice={totalPrice}
                                onEdit={(s) => setStep(s)}
                                onCheckout={handleCheckout}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>

                    {/* Sticky bottom navigation */}
                    {step < 5 && (
                        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-sm border-t border-border -mx-4 px-4 py-4 mt-8 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                            <div className="max-w-2xl mx-auto flex items-center justify-between">
                                <button
                                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                                    disabled={step === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-white font-body font-medium text-sm hover:bg-cream transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>

                                {/* Mobile total */}
                                {selections.variant && (
                                    <div className="flex flex-col items-center md:hidden">
                                        <span className="text-[10px] text-muted-foreground font-body uppercase">Total</span>
                                        <span className="font-display font-bold text-lg text-gold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setStep((s) => Math.min(5, s + 1));
                                        window.scrollTo({ top: builderRef.current?.offsetTop ?? 0, behavior: "smooth" });
                                    }}
                                    disabled={!canContinue()}
                                    className="flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl font-body font-bold text-sm hover:bg-gold-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
