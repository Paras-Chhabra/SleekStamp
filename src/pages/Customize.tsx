import { useState, useRef, useCallback } from "react";
import { useShopifyProducts } from "@/hooks/useShopify";
import { createShopifyCheckout } from "@/utils/shopify";
import { uploadToCloudinary } from "@/utils/cloudinary";
import Navbar from "@/components/Navbar";
import { Upload, Check, ArrowRight, ArrowLeft, Zap, Droplets, Shield, Sparkles, Clock, Palette, Box, FileImage, Info, Star } from "lucide-react";

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

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════ */

function ProgressBar({ step, onStepClick }: { step: number; onStepClick: (s: number) => void }) {
    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto py-2.5 px-2">
            {STEP_LABELS.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                    <button
                        key={label}
                        onClick={() => i < step && onStepClick(i)}
                        className={`flex flex-col items-center gap-1 transition-all ${i < step ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                ${done ? "bg-green-500 text-white" : active ? "bg-gold text-white ring-3 ring-gold/20" : "bg-gray-200 text-gray-500"}`}
                        >
                            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-body font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
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

const SIZE_META: Record<string, { icon: React.ReactNode; desc: string }> = {
    "M - 4 Inch": { icon: <Box className="w-5 h-5" />, desc: "Perfect for envelopes & small boxes" },
    "L - 6 Inch": { icon: <Box className="w-6 h-6" />, desc: "Best seller — ideal for shipping boxes" },
    "XL - 8 Inch": { icon: <Box className="w-7 h-7" />, desc: "Maximum impact for large surfaces" },
};

function StepSize({ variants, selected, onSelect }: { variants: Variant[]; selected: Variant | null; onSelect: (v: Variant) => void }) {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Box className="w-3 h-3 text-gold" />
                </div>
                <h2 className="font-display text-xl font-bold">Select Your Stamp Size</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">Choose the size that fits your branding needs.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {variants.map((v) => {
                    const active = selected?.id === v.id;
                    const meta = SIZE_META[v.title];
                    return (
                        <button
                            key={v.id}
                            onClick={() => onSelect(v)}
                            disabled={!v.available}
                            className={`relative p-4 rounded-xl border-2 text-center transition-all duration-300
                ${active ? "border-gold bg-gradient-to-b from-gold/8 to-gold/3 shadow-md shadow-gold/10 scale-[1.02]" : "border-border bg-white hover:border-gold/40 hover:shadow-sm"}
                ${!v.available ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            {active && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                            <div className="font-display font-bold text-sm mb-0.5">{v.title}</div>
                            <div className="text-lg font-bold text-gold font-body mb-1">${v.price.toFixed(2)}</div>
                            {meta && <p className="text-[10px] text-muted-foreground font-body leading-snug">{meta.desc}</p>}
                            {!v.available && <div className="text-[10px] text-red-500 mt-0.5">Out of stock</div>}
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
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <FileImage className="w-3 h-3 text-gold" />
                </div>
                <h2 className="font-display text-xl font-bold">Upload Your Design</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">
                Upload your logo, artwork, or signature. We accept PNG, JPG, PDF, AI, and EPS files.
            </p>

            {logoPreview ? (
                <div className="bg-gradient-to-b from-cream/50 to-white border border-border rounded-2xl p-8 text-center">
                    <img src={logoPreview} alt="Logo preview" className="max-h-48 mx-auto rounded-xl mb-4 shadow-md border border-border" />
                    <p className="text-sm font-body text-muted-foreground mb-4">{logoFile?.name}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-5 py-2.5 rounded-xl border border-border bg-white text-sm font-body font-medium hover:bg-cream transition-smooth shadow-sm"
                        >
                            Replace
                        </button>
                        <button
                            onClick={onRemove}
                            className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50/80 text-sm font-body font-medium hover:bg-red-100 transition-smooth"
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
                    className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
            ${dragOver ? "border-gold bg-gold/5 scale-[1.01]" : "border-gray-300 bg-gradient-to-b from-cream/30 to-white hover:border-gold/50 hover:bg-gold/3"}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-5 h-5 text-gold" />
                    </div>
                    <p className="font-body font-semibold text-foreground text-sm mb-1">
                        Drag & drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                        or <span className="text-gold font-medium underline underline-offset-2">click to browse</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {["PNG", "JPG", "PDF", "AI", "EPS"].map((fmt) => (
                            <span key={fmt} className="px-2.5 py-1 rounded-md bg-gray-100 text-[10px] font-body font-semibold text-gray-500 uppercase tracking-wider">{fmt}</span>
                        ))}
                    </div>
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

            {/* Helpful note */}
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-body text-blue-700 leading-relaxed">
                    We'll send a free digital proof before production. You can always swap or adjust your design later!
                </p>
            </div>
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
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Droplets className="w-3 h-3 text-gold" />
                </div>
                <h2 className="font-display text-xl font-bold">Add a Stamp Pad?</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">Get a matching ink pad for crisp, professional impressions.</p>

            {/* Why add a stamp pad? */}
            <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <h3 className="font-display font-bold text-xs text-amber-900">Why add a stamp pad?</h3>
                </div>
                <ul className="space-y-1.5">
                    {[
                        { icon: <Droplets className="w-3.5 h-3.5" />, text: "Pre-inked pads deliver 5,000+ impressions — no re-inking needed" },
                        { icon: <Shield className="w-3.5 h-3.5" />, text: "Engineered for your stamp size — ensures edge-to-edge coverage" },
                        { icon: <Star className="w-3.5 h-3.5" />, text: "Water-based, eco-friendly ink that dries in seconds" },
                        { icon: <Clock className="w-3.5 h-3.5" />, text: "Save time — stamp pad ships ready to use, no setup required" },
                    ].map(({ icon, text }, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5 flex-shrink-0">{icon}</span>
                            <span className="text-[11px] font-body text-amber-800 leading-snug">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2">
                {/* Stamp pad options FIRST */}
                {options.map((opt) => {
                    const active = selected?.variantId === opt.variantId;
                    return (
                        <button
                            key={opt.variantId}
                            onClick={() => onToggle(opt)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-300
                ${active ? "border-gold bg-gradient-to-r from-gold/8 to-gold/3 shadow-md shadow-gold/10" : "border-border bg-white hover:border-gold/40 hover:shadow-sm"}`}
                        >
                            <div className="text-left flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? "bg-gold/20" : "bg-gray-100"}`}>
                                    <Droplets className={`w-3.5 h-3.5 ${active ? "text-gold" : "text-gray-400"}`} />
                                </div>
                                <div>
                                    <span className="font-body font-medium text-sm block">{opt.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-body">Perfectly sized for your stamp</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-body font-bold text-gold">+${opt.price.toFixed(2)}</span>
                                {active && <Check className="w-4 h-4 text-gold" />}
                            </div>
                        </button>
                    );
                })}

                {/* "Already have a stamp pad" — LAST */}
                <button
                    onClick={() => onToggle(null)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-300
            ${!selected ? "border-gold bg-gradient-to-r from-gold/8 to-gold/3 shadow-md shadow-gold/10" : "border-border bg-white hover:border-gold/40"}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${!selected ? "bg-gold/20" : "bg-gray-100"}`}>
                            <Check className={`w-3.5 h-3.5 ${!selected ? "text-gold" : "text-gray-400"}`} />
                        </div>
                        <span className="font-body font-medium">Already have a stamp pad</span>
                    </div>
                    <span className="font-body text-sm text-muted-foreground">$0.00</span>
                </button>
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
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Palette className="w-3 h-3 text-gold" />
                </div>
                <h2 className="font-display text-xl font-bold">Choose Ink Color</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">Select the ink color for your stamp impression.</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {INK_COLORS.map(({ name, hex }) => {
                    const active = selected === name;
                    return (
                        <button
                            key={name}
                            onClick={() => onSelect(name)}
                            className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-300
                ${active ? "border-gold bg-gradient-to-b from-gold/8 to-gold/3 shadow-md shadow-gold/10 scale-[1.02]" : "border-border bg-white hover:border-gold/40 hover:shadow-sm"}`}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: hex, boxShadow: `0 4px 12px ${hex}40` }} />
                                {active && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <span className="font-body font-medium text-sm">{name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Preview hint */}
            {selected && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-border">
                    <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: INK_COLORS.find(c => c.name === selected)?.hex }} />
                    <span className="text-sm font-body text-muted-foreground">Your stamp will use <strong className="text-foreground">{selected}</strong> ink</span>
                </div>
            )}
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
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-gold" />
                </div>
                <h2 className="font-display text-xl font-bold">Priority Processing</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">Want your stamp made and shipped faster? Skip the queue!</p>

            <div className="space-y-2">
                <button
                    onClick={() => selected && onToggle()}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
            ${!selected ? "border-gold bg-gradient-to-r from-gold/8 to-gold/3 shadow-md shadow-gold/10" : "border-border bg-white hover:border-gold/40 hover:shadow-sm"}`}
                >
                    <div className="text-left flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${!selected ? "bg-gold/15" : "bg-gray-100"}`}>
                            <Clock className={`w-4 h-4 ${!selected ? "text-gold" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <span className="font-body font-medium block">Standard Processing</span>
                            <span className="text-xs text-muted-foreground font-body">Ships in 1–3 business days</span>
                        </div>
                    </div>
                    <span className="font-body text-sm text-muted-foreground">Included</span>
                </button>

                <button
                    onClick={() => !selected && onToggle()}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
            ${selected ? "border-gold bg-gradient-to-r from-gold/8 to-amber-50/50 shadow-md shadow-gold/10" : "border-border bg-white hover:border-gold/40 hover:shadow-sm"}`}
                >
                    {selected && (
                        <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-body font-bold uppercase tracking-wider">Popular</span>
                        </div>
                    )}
                    <div className="text-left flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-amber-100" : "bg-gray-100"}`}>
                            <Zap className={`w-4 h-4 ${selected ? "text-amber-600" : "text-gray-400"}`} />
                        </div>
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

const REVIEW_ICONS = [
    <Box className="w-4 h-4" />,
    <FileImage className="w-4 h-4" />,
    <Droplets className="w-4 h-4" />,
    <Palette className="w-4 h-4" />,
    <Clock className="w-4 h-4" />,
];

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
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                </div>
                <h2 className="font-display text-xl font-bold">Review Your Order</h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-4 ml-8">Make sure everything looks perfect before checkout.</p>

            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {rows.map(({ label, value, price, step }, i) => (
                    <div
                        key={label}
                        className={`flex items-center justify-between px-4 py-3 ${i < rows.length - 1 ? "border-b border-border" : ""} hover:bg-cream/30 transition-colors`}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                {REVIEW_ICONS[i]}
                            </div>
                            <div>
                                <div className="text-[9px] text-muted-foreground font-body uppercase tracking-wider mb-0.5">{label}</div>
                                <div className="font-body font-medium text-xs">{value}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {price > 0 && <span className="font-body font-bold text-sm">${price.toFixed(2)}</span>}
                            <button onClick={() => onEdit(step)} className="text-xs text-gold font-body font-semibold hover:underline underline-offset-2">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}

                {selections.logoPreview && (
                    <div className="p-5 border-t border-border bg-cream/20 flex items-center gap-4">
                        <img src={selections.logoPreview} alt="Logo" className="w-16 h-16 object-contain rounded-lg border border-border bg-white p-1 shadow-sm" />
                        <span className="text-sm font-body text-muted-foreground">Your uploaded design</span>
                    </div>
                )}

                <div className="flex items-center justify-between px-4 py-4 bg-navy text-white">
                    <span className="font-display font-bold">Total</span>
                    <span className="font-display font-bold text-xl">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={isSubmitting || !selections.variant}
                className="mt-4 w-full bg-gold text-navy py-3.5 rounded-xl font-body font-bold text-sm hover:bg-gold-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Creating Checkout…
                    </span>
                ) : (
                    <>
                        <ArrowRight className="w-4 h-4" /> Checkout — ${totalPrice.toFixed(2)}
                    </>
                )}
            </button>

            {/* Trust badges */}
            <div className="mt-5 flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-body">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-body">Satisfaction Guaranteed</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOMIZE PAGE — Builder-only, shown at /customize
   ═══════════════════════════════════════════════════════════════════════ */

export default function Customize() {
    const { data, isLoading } = useShopifyProducts();
    const products = data?.display ?? [];
    const allProducts = data?.all ?? [];

    const product = products.find((p) => p.slug === "big-custom-stamps-by-sleekstamp") ?? products.find((p) => p.category === "custom-stamps");

    const stampPadProducts = allProducts.filter((p) => p.category === "stamp-pad");
    const priorityProduct = allProducts.find((p) => p.name.toLowerCase().includes("priority processing"));

    const stampPadOptions: StampPadOption[] = stampPadProducts
        .sort((a, b) => a.price - b.price)
        .map((p) => ({ name: p.name, price: p.price, variantId: p.defaultVariantId ?? "" }));

    const priorityPrice = priorityProduct?.price ?? 4.99;

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

    const variants: Variant[] = (product?.sizes ?? []).map((s) => ({
        id: s.variantId ?? "",
        title: s.label,
        price: s.price,
        available: true,
    }));

    const totalPrice =
        (selections.variant?.price ?? 0) +
        (selections.stampPad?.price ?? 0) +
        (selections.priorityProcessing ? priorityPrice : 0);

    const canContinue = () => {
        switch (step) {
            case 0: return !!selections.variant;
            case 1: return !!selections.logoFile;
            case 2: return true;
            case 3: return !!selections.inkColor;
            case 4: return true;
            default: return true;
        }
    };

    const handleCheckout = async () => {
        if (!selections.variant) return;
        setIsSubmitting(true);

        try {
            // 1. Upload logo to Cloudinary if provided
            let logoUrl: string | null = null;
            if (selections.logoFile) {
                logoUrl = await uploadToCloudinary(selections.logoFile);
            }

            // 2. Build line items with custom attributes
            const lineItems: any[] = [];

            lineItems.push({
                variantId: selections.variant.id,
                quantity: 1,
                logoUrl: logoUrl,
                inkColor: selections.inkColor,
                stampPad: selections.stampPad?.name ?? null,
                priorityProcessing: selections.priorityProcessing,
            });

            if (selections.stampPad) {
                lineItems.push({
                    variantId: selections.stampPad.variantId,
                    quantity: 1,
                });
            }

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section ref={builderRef} className="flex-1 py-6 md:py-8 bg-gradient-to-b from-cream/40 via-white to-cream/20" id="builder">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-body font-semibold mb-2 tracking-wide uppercase">Step {step + 1} of 6</div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Build Your Custom Stamp</h1>
                        <p className="text-muted-foreground font-body text-sm">Complete each step to customize your stamp.</p>
                    </div>

                    {/* Sticky progress bar */}
                    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border/60 -mx-4 px-4 mb-4 shadow-sm">
                        <ProgressBar step={step} onStepClick={(s) => setStep(s)} />

                        {selections.variant && (
                            <div className="hidden md:flex items-center justify-end pb-3 gap-2">
                                <span className="text-sm text-muted-foreground font-body">Live Total:</span>
                                <span className="font-display font-bold text-xl text-gold">${totalPrice.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Step content */}
                    <div className="max-w-2xl mx-auto min-h-[240px]">
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
                        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-sm border-t border-border -mx-4 px-4 py-3 mt-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                            <div className="max-w-2xl mx-auto flex items-center justify-between">
                                <button
                                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                                    disabled={step === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-white font-body font-medium text-sm hover:bg-cream transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>

                                {selections.variant && (
                                    <div className="flex flex-col items-center md:hidden">
                                        <span className="text-[10px] text-muted-foreground font-body uppercase">Total</span>
                                        <span className="font-display font-bold text-lg text-gold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setStep((s) => Math.min(5, s + 1));
                                        window.scrollTo({ top: 0, behavior: "smooth" });
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
        </div>
    );
}
