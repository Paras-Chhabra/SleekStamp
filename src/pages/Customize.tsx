import { useState, useRef, useCallback } from "react";
import { useShopifyProducts } from "@/hooks/useShopify";
import { createShopifyCheckout } from "@/utils/shopify";
import { uploadToCloudinary } from "@/utils/cloudinary";
import Navbar from "@/components/Navbar";
import { Upload, Check, ArrowRight, ArrowLeft, Zap, Droplets, Shield, Sparkles, Clock, Palette, Box, FileImage, Info, Star, Pencil, ImagePlus } from "lucide-react";

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
    logoUrl: string | null;
    logoUploading: boolean;
    stampPad: StampPadOption | null;
    inkColor: string;
    priorityProcessing: boolean;
    priorityVariantId: string | null;
    priorityPrice: number;
    designFee: number;
    designBrief: string;
    referenceImageFile: File | null;
    referenceImagePreview: string | null;
    referenceImageUrl: string | null;
    referenceImageUploading: boolean;
    tipAmount: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const STEP_LABELS = ["Size", "Logo", "Pad", "Ink", "Speed", "Tip", "Review"];

const INK_COLORS: { name: string; hex: string }[] = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "Blue", hex: "#1e40af" },
    { name: "Red", hex: "#dc2626" },
    { name: "Green", hex: "#16a34a" },
    { name: "Purple", hex: "#7c3aed" },
];

const STEP_TITLES = ["Select Size", "Your Logo", "Stamp Pad", "Ink Color", "Processing", "Add a Tip", "Review"];

function ProgressBar({ step, onStepClick }: { step: number; onStepClick: (s: number) => void }) {
    return (
        <div className="w-full">
            {/* Progress line */}
            <div className="relative h-1 bg-gray-200 w-full mb-3">
                <div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500 ease-out"
                    style={{ width: `${((step) / (STEP_LABELS.length - 1)) * 100}%` }}
                />
            </div>
            {/* Labels */}
            <div className="flex justify-between">
                {STEP_LABELS.map((label, i) => {
                    const done = i < step;
                    const active = i === step;
                    return (
                        <button
                            key={label}
                            onClick={() => i < step && onStepClick(i)}
                            className={`text-xs font-body font-medium transition-all ${i < step ? "cursor-pointer" : "cursor-default"}
                                ${active ? "text-red-600 font-bold" : done ? "text-red-600" : "text-gray-400"}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1 — SIZE
   ═══════════════════════════════════════════════════════════════════════ */

const SIZE_META: Record<string, { shortSize: string; desc: string }> = {
    "M - 4 Inch": { shortSize: "4\" × 4\"", desc: "Small boxes & mailers" },
    "L - 6 Inch": { shortSize: "6\" × 6\"", desc: "Medium boxes" },
    "XL - 8 Inch": { shortSize: "8\" × 8\"", desc: "Large shipping boxes" },
};

function StepSize({ variants, selected, onSelect }: { variants: Variant[]; selected: Variant | null; onSelect: (v: Variant) => void }) {
    // Extract size number from title like "M - 4 Inch" -> "4"
    const getSizeNum = (title: string) => {
        const match = title.match(/(\d+)/);
        return match ? match[1] : "";
    };
    const isPopular = (title: string) => title === "L - 6 Inch";

    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-lg font-bold text-center mb-0.5">What size stamp do you need?</h2>
            <p className="text-muted-foreground font-body text-xs mb-3 text-center">Choose based on your most common package size.</p>

            <div className="space-y-2">
                {variants.map((v) => {
                    const active = selected?.id === v.id;
                    const meta = SIZE_META[v.title];
                    const sizeNum = getSizeNum(v.title);
                    return (
                        <button
                            key={v.id}
                            onClick={() => onSelect(v)}
                            disabled={!v.available}
                            className={`relative w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 transition-all duration-300 text-left
                ${active ? "border-red-600 bg-gradient-to-r from-gold/5 to-gold/2 shadow-sm shadow-red-600/10" : "border-border bg-white hover:border-red-600/40"}
                ${!v.available ? "opacity-40 cursor-not-allowed" : ""}`}
                        >

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-display font-semibold text-base">{meta?.shortSize ?? v.title}</span>
                                    {isPopular(v.title) && (
                                        <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-body font-bold uppercase">Best Seller</span>
                                    )}
                                </div>
                                {meta && <p className="text-xs text-muted-foreground font-body font-normal">{meta.desc}</p>}
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="font-body font-bold text-sm text-foreground">${v.price.toFixed(2)}</span>
                                <span className="font-body text-sm text-muted-foreground line-through">${(v.price * 2).toFixed(2)}</span>
                            </div>

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
    designOption,
    onDesignOptionChange,
    designBrief,
    onDesignBriefChange,
    referenceImagePreview,
    onReferenceImageUpload,
    onReferenceImageRemove,
    referenceImageUploading,
}: {
    logoFile: File | null;
    logoPreview: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
    designOption: "upload" | "design";
    onDesignOptionChange: (opt: "upload" | "design") => void;
    designBrief: string;
    onDesignBriefChange: (text: string) => void;
    referenceImagePreview: string | null;
    onReferenceImageUpload: (file: File) => void;
    onReferenceImageRemove: () => void;
    referenceImageUploading: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const refImageInputRef = useRef<HTMLInputElement>(null);
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
            <h2 className="font-display text-lg font-bold text-center mb-0.5">Your Logo</h2>
            <p className="text-muted-foreground font-body text-xs mb-3 text-center">Upload your print-ready design or let us create one.</p>

            {/* Radio options */}
            <div className="space-y-2 mb-3">
                <button
                    onClick={() => onDesignOptionChange("upload")}
                    className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 text-left
                        ${designOption === "upload" ? "border-red-600 bg-red-600/5" : "border-border bg-white hover:border-red-600/40"}`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${designOption === "upload" ? "border-red-600" : "border-gray-300"}`}>
                        {designOption === "upload" && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                    </div>
                    <span className="font-body font-semibold text-sm flex-1">I'll upload my logo</span>
                    <span className="font-body text-sm text-muted-foreground">Free</span>
                </button>

                <button
                    onClick={() => onDesignOptionChange("design")}
                    className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 text-left
                        ${designOption === "design" ? "border-red-600 bg-red-600/5" : "border-border bg-white hover:border-red-600/40"}`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${designOption === "design" ? "border-red-600" : "border-gray-300"}`}>
                        {designOption === "design" && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                    </div>
                    <span className="font-body font-semibold text-sm flex-1">We design for you</span>
                    <span className="font-body text-sm text-muted-foreground">+ $30</span>
                </button>
            </div>

            {/* Upload area (only when upload option selected) */}
            {designOption === "upload" && (
                <>
                    {logoPreview ? (
                        <div className="border border-border rounded-xl p-4 text-center bg-white">
                            <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto rounded-lg mb-3 shadow-sm border border-border" />
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
                            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                                ${dragOver ? "border-red-600 bg-red-600/5" : "border-gray-300 bg-white hover:border-red-600/50"}`}
                        >
                            <Upload className="w-5 h-5 text-red-600 mx-auto mb-2" />
                            <p className="font-body font-semibold text-foreground text-sm mb-0.5">Tap to upload your logo</p>
                            <p className="text-xs text-muted-foreground font-body">PNG, JPG, PDF, AI, EPS</p>
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
                </>
            )}

            {/* Design brief area (only when "We design for you" is selected) */}
            {designOption === "design" && (
                <div className="space-y-3">
                    {/* Text area for design brief */}
                    <div>
                        <label className="flex items-center gap-1.5 font-body font-semibold text-sm text-foreground mb-1.5">
                            <Pencil className="w-3.5 h-3.5 text-red-600" />
                            Describe your design
                        </label>
                        <textarea
                            value={designBrief}
                            onChange={(e) => onDesignBriefChange(e.target.value)}
                            placeholder="E.g. Our company logo with 'SleekStamp' text underneath, use bold font, keep it clean and minimal..."
                            className="w-full border-2 border-border rounded-xl p-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:border-red-600 focus:outline-none transition-colors resize-none bg-white"
                            rows={3}
                        />
                    </div>

                    {/* Optional reference image */}
                    <div>
                        <label className="flex items-center gap-1.5 font-body font-semibold text-sm text-foreground mb-1.5">
                            <ImagePlus className="w-3.5 h-3.5 text-red-600" />
                            Reference image <span className="font-normal text-muted-foreground text-xs">(optional)</span>
                        </label>
                        {referenceImagePreview ? (
                            <div className="border border-border rounded-xl p-3 bg-white flex items-center gap-3">
                                <img src={referenceImagePreview} alt="Reference" className="w-14 h-14 object-cover rounded-lg border border-border" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-body text-muted-foreground truncate">
                                        {referenceImageUploading ? "Uploading..." : "Reference uploaded ✓"}
                                    </p>
                                </div>
                                <button
                                    onClick={onReferenceImageRemove}
                                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50/80 text-xs font-body font-medium hover:bg-red-100 transition-smooth"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => refImageInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-red-600/50 transition-all duration-300 bg-white"
                            >
                                <ImagePlus className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground font-body">Tap to upload a reference image</p>
                            </button>
                        )}
                        <input
                            ref={refImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onReferenceImageUpload(file);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Info note */}
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-body text-blue-700 leading-relaxed">
                    We send you a digital proof to review before we dispatch your stamp.
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
            <div className="flex items-center gap-2 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center">
                    <Droplets className="w-3 h-3 text-red-600" />
                </div>
                <h2 className="font-display text-lg font-bold">Add a Stamp Pad?</h2>
            </div>
            <p className="text-muted-foreground font-body text-xs mb-3 ml-7">Get a matching ink pad for crisp impressions.</p>

            {/* Why add a stamp pad? */}
            <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-100 hidden sm:block">
                <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <h3 className="font-display font-bold text-xs text-amber-900">Why add a stamp pad?</h3>
                </div>
                <ul className="space-y-1">
                    {[
                        { icon: <Droplets className="w-3 h-3" />, text: "5,000+ impressions — no re-inking needed" },
                        { icon: <Shield className="w-3 h-3" />, text: "Engineered for edge-to-edge coverage" },
                        { icon: <Star className="w-3 h-3" />, text: "Eco-friendly ink dries in seconds" },
                    ].map(({ icon, text }, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                            <span className="text-amber-600 flex-shrink-0">{icon}</span>
                            <span className="text-[10px] font-body text-amber-800 leading-snug">{text}</span>
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
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-300
                ${active ? "border-red-600 bg-gradient-to-r from-gold/8 to-gold/3 shadow-sm" : "border-border bg-white hover:border-red-600/40"}`}
                        >
                            <div className="text-left flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? "bg-red-600/20" : "bg-gray-100"}`}>
                                    <Droplets className={`w-3.5 h-3.5 ${active ? "text-red-600" : "text-gray-400"}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-body font-medium text-sm block">{opt.name}</span>
                                        {opt.name.includes("XL") && (
                                            <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-body font-bold uppercase">Best Seller</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-body">Perfectly sized for your stamp</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-body font-bold text-sm text-foreground">+${opt.price.toFixed(2)}</span>
                                <span className="font-body text-sm text-muted-foreground line-through">${(opt.price * 2).toFixed(2)}</span>
                                {active && <Check className="w-4 h-4 text-red-600" />}
                            </div>
                        </button>
                    );
                })}

                {/* "Already have a stamp pad" — LAST */}
                <button
                    onClick={() => onToggle(null)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-300
            ${!selected ? "border-red-600 bg-gradient-to-r from-gold/8 to-gold/3 shadow-sm shadow-red-600/10" : "border-border bg-white hover:border-red-600/40"}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${!selected ? "bg-red-600/20" : "bg-gray-100"}`}>
                            <Check className={`w-3 h-3 ${!selected ? "text-red-600" : "text-gray-400"}`} />
                        </div>
                        <span className="font-body font-medium text-sm">Already have a stamp pad</span>
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
            <div className="flex items-center gap-2 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center">
                    <Palette className="w-3 h-3 text-red-600" />
                </div>
                <h2 className="font-display text-lg font-bold">Choose Ink Color</h2>
            </div>
            <p className="text-muted-foreground font-body text-xs mb-3 ml-7">Select the ink color for your stamp impression.</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {INK_COLORS.map(({ name, hex }) => {
                    const active = selected === name;
                    return (
                        <button
                            key={name}
                            onClick={() => onSelect(name)}
                            className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-300
                ${active ? "border-red-600 bg-gradient-to-b from-gold/8 to-gold/3 shadow-md shadow-red-600/10 scale-[1.02]" : "border-border bg-white hover:border-red-600/40 hover:shadow-sm"}`}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: hex, boxShadow: `0 4px 12px ${hex}40` }} />
                                {active && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <span className="font-body font-medium text-sm">{name}</span>
                            {(name === "Black" || name === "Blue") && (
                                <span className="px-1.5 py-0.5 rounded bg-gray-900 text-white text-[9px] font-body font-bold uppercase leading-none">Best Seller</span>
                            )}
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
            <div className="flex items-center gap-2 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-red-600" />
                </div>
                <h2 className="font-display text-lg font-bold">Priority Processing</h2>
            </div>
            <p className="text-muted-foreground font-body text-xs mb-3 ml-7">Want your stamp made faster? Skip the queue!</p>

            <div className="space-y-2">
                <button
                    onClick={() => selected && onToggle()}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300
            ${!selected ? "border-red-600 bg-gradient-to-r from-gold/8 to-gold/3 shadow-sm" : "border-border bg-white hover:border-red-600/40"}`}
                >
                    <div className="text-left flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${!selected ? "bg-red-600/15" : "bg-gray-100"}`}>
                            <Clock className={`w-3.5 h-3.5 ${!selected ? "text-red-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <span className="font-body font-medium text-sm block">Standard</span>
                            <span className="text-[10px] text-muted-foreground font-body">Ships in 1–3 days</span>
                        </div>
                    </div>
                    <span className="font-body text-sm text-muted-foreground">Included</span>
                </button>

                <button
                    onClick={() => !selected && onToggle()}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
            ${selected ? "border-red-600 bg-gradient-to-r from-gold/8 to-amber-50/50 shadow-sm" : "border-border bg-white hover:border-red-600/40"}`}
                >
                    {selected && (
                        <div className="absolute top-1 right-1">
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[8px] font-body font-bold uppercase tracking-wider">Popular</span>
                        </div>
                    )}
                    <div className="text-left flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${selected ? "bg-amber-100" : "bg-gray-100"}`}>
                            <Zap className={`w-3.5 h-3.5 ${selected ? "text-amber-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <span className="font-body font-medium text-sm block">Priority Processing</span>
                            <span className="text-[10px] text-muted-foreground font-body">Ships within 24 hours</span>
                        </div>
                    </div>
                    <span className="font-body font-bold text-red-600">+${price.toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 6 — TIP
   ═══════════════════════════════════════════════════════════════════════ */

function StepTip({
    totalPrice,
    tipAmount,
    onTipChange,
}: {
    totalPrice: number;
    tipAmount: number;
    onTipChange: (amount: number) => void;
}) {
    const [customTip, setCustomTip] = useState(tipAmount > 0 && ![0.05, 0.10, 0.15].some(p => Math.abs(tipAmount - Math.round(totalPrice * p * 100) / 100) < 0.01) ? tipAmount.toFixed(2) : "");
    const presets = [
        { label: "5%", pct: 0.05 },
        { label: "10%", pct: 0.10 },
        { label: "15%", pct: 0.15 },
    ];

    const isPreset = (pct: number) => Math.abs(tipAmount - Math.round(totalPrice * pct * 100) / 100) < 0.01;
    const isNone = tipAmount === 0;

    return (
        <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold mb-1">Add a Tip</h2>

            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-body text-sm text-foreground">Show your support for the team at SleekStamp</span>
                </div>

                {/* Preset buttons */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {presets.map(({ label, pct }) => {
                        const amount = Math.round(totalPrice * pct * 100) / 100;
                        const active = isPreset(pct);
                        return (
                            <button
                                key={label}
                                onClick={() => { onTipChange(amount); setCustomTip(""); }}
                                className={`py-3 rounded-xl border-2 text-center transition-all duration-200 ${active
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-border bg-white text-foreground hover:border-gray-300"
                                    }`}
                            >
                                <div className="font-body font-bold text-base">{label}</div>
                                <div className="font-body text-sm text-muted-foreground">${amount.toFixed(2)}</div>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => { onTipChange(0); setCustomTip(""); }}
                        className={`py-3 rounded-xl border-2 text-center transition-all duration-200 ${isNone
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-border bg-white text-foreground hover:border-gray-300"
                            }`}
                    >
                        <div className="font-body font-bold text-base">None</div>
                    </button>
                </div>

                {/* Custom tip */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 flex items-center border-2 border-border rounded-xl overflow-hidden">
                        <span className="pl-4 text-muted-foreground font-body">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Custom tip"
                            value={customTip}
                            onChange={(e) => {
                                setCustomTip(e.target.value);
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val >= 0) onTipChange(Math.round(val * 100) / 100);
                                else if (e.target.value === "") onTipChange(0);
                            }}
                            className="flex-1 py-3 px-2 bg-transparent text-sm font-body outline-none"
                        />
                        <button
                            onClick={() => {
                                const val = Math.max(0, (parseFloat(customTip) || 0) - 1);
                                setCustomTip(val > 0 ? val.toFixed(2) : "");
                                onTipChange(val);
                            }}
                            className="px-3 text-lg text-muted-foreground hover:text-foreground"
                        >−</button>
                        <button
                            onClick={() => {
                                const val = (parseFloat(customTip) || 0) + 1;
                                setCustomTip(val.toFixed(2));
                                onTipChange(Math.round(val * 100) / 100);
                            }}
                            className="px-3 text-lg text-muted-foreground hover:text-foreground"
                        >+</button>
                    </div>
                </div>

                <p className="font-body text-sm text-muted-foreground">Thank you, we appreciate it.</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 7 — REVIEW
   ═══════════════════════════════════════════════════════════════════════ */

const REVIEW_ICONS = [
    <Box className="w-3.5 h-3.5" />,
    <FileImage className="w-3.5 h-3.5" />,
    <Droplets className="w-3.5 h-3.5" />,
    <Palette className="w-3.5 h-3.5" />,
    <Clock className="w-3.5 h-3.5" />,
    <Sparkles className="w-3.5 h-3.5" />,
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
        { label: "Your Design", value: selections.designFee > 0 ? "We design for you" : (selections.logoFile?.name ?? "No file uploaded"), price: selections.designFee, step: 1 },
        { label: "Stamp Pad", value: selections.stampPad ? selections.stampPad.name : "None", price: selections.stampPad?.price ?? 0, step: 2 },
        { label: "Ink Color", value: selections.inkColor, price: 0, step: 3 },
        { label: "Processing", value: selections.priorityProcessing ? "Priority (24h)" : "Standard (1–3 days)", price: selections.priorityProcessing ? selections.priorityPrice : 0, step: 4 },
        { label: "Tip", value: selections.tipAmount > 0 ? `$${selections.tipAmount.toFixed(2)}` : "None", price: selections.tipAmount, step: 5 },
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
                            <button onClick={() => onEdit(step)} className="text-xs text-red-600 font-body font-semibold hover:underline underline-offset-2">
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
    const designServiceProduct = allProducts.find((p) => p.name.toLowerCase().includes("custom design service"));

    const stampPadOptions: StampPadOption[] = stampPadProducts
        .sort((a, b) => a.price - b.price)
        .map((p) => ({ name: p.name, price: p.price, variantId: p.defaultVariantId ?? "" }));

    const priorityPrice = priorityProduct?.price ?? 4.99;

    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<BuilderSelections>({
        variant: null,
        logoFile: null,
        logoPreview: null,
        logoUrl: null,
        logoUploading: false,
        stampPad: null,
        inkColor: "Black",
        priorityProcessing: false,
        priorityVariantId: priorityProduct?.defaultVariantId ?? null,
        priorityPrice,
        designFee: 0,
        designBrief: "",
        referenceImageFile: null,
        referenceImagePreview: null,
        referenceImageUrl: null,
        referenceImageUploading: false,
        tipAmount: 0,
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
        (selections.priorityProcessing ? priorityPrice : 0) +
        selections.designFee +
        selections.tipAmount;

    const canContinue = () => {
        switch (step) {
            case 0: return !!selections.variant;
            case 1: return !!selections.logoFile || selections.designFee > 0;
            case 2: return true;
            case 3: return !!selections.inkColor;
            case 4: return true;
            case 5: return true;
            default: return true;
        }
    };

    const handleCheckout = async () => {
        if (!selections.variant) return;
        setIsSubmitting(true);

        try {
            // Use the pre-uploaded logo URL (already uploaded in Step 2)
            const logoUrl = selections.logoUrl;

            // Build line items with custom attributes
            const lineItems: any[] = [];

            // Build custom attributes for the stamp
            const stampAttributes: { key: string; value: string }[] = [];
            if (logoUrl) stampAttributes.push({ key: "Logo URL", value: logoUrl });
            if (selections.inkColor) stampAttributes.push({ key: "Ink Color", value: selections.inkColor });
            if (selections.stampPad) stampAttributes.push({ key: "Stamp Pad", value: selections.stampPad.name });
            if (selections.priorityProcessing) stampAttributes.push({ key: "Priority Processing", value: "Yes" });
            if (selections.designFee > 0) {
                stampAttributes.push({ key: "Design Service", value: "We design for you" });
                if (selections.designBrief) stampAttributes.push({ key: "Design Brief", value: selections.designBrief });
                if (selections.referenceImageUrl) stampAttributes.push({ key: "Reference Image", value: selections.referenceImageUrl });
            }

            lineItems.push({
                variantId: selections.variant.id,
                quantity: 1,
                logoUrl: logoUrl,
                inkColor: selections.inkColor,
                stampPad: selections.stampPad?.name ?? null,
                priorityProcessing: selections.priorityProcessing,
                designBrief: selections.designBrief || null,
                referenceImageUrl: selections.referenceImageUrl || null,
                designService: selections.designFee > 0,
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

            // Add design service product ($30) if customer chose "We design for you"
            if (selections.designFee > 0 && designServiceProduct?.defaultVariantId) {
                lineItems.push({
                    variantId: designServiceProduct.defaultVariantId,
                    quantity: 1,
                    designBrief: selections.designBrief || null,
                    referenceImageUrl: selections.referenceImageUrl || null,
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
                    <div className="w-10 h-10 border-4 border-red-600/30 border-t-gold rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* Top bar: back arrow | step title | running total */}
            <div className="border-b border-border bg-white shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between h-11">
                    <button
                        onClick={() => step > 0 ? setStep((s) => Math.max(0, s - 1)) : window.history.back()}
                        className="p-1 -ml-1 rounded-full hover:bg-cream transition-smooth text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h2 className="font-display font-bold text-sm">{STEP_TITLES[step]}</h2>
                    <span className="font-display font-bold text-sm text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white">
                <div className="container mx-auto px-4 pt-2">
                    <ProgressBar step={step} onStepClick={(s) => setStep(s)} />
                </div>
            </div>

            {/* Step content — fills available space */}
            <section ref={builderRef} className="flex-1 bg-white" id="builder">
                <div className="container mx-auto px-4 py-3 md:py-6">
                    <div className="max-w-xl mx-auto">
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
                                designOption={selections.designFee > 0 ? "design" : "upload"}
                                onDesignOptionChange={(opt) => {
                                    setSelections((s) => ({
                                        ...s,
                                        designFee: opt === "design" ? 30 : 0,
                                        // Clear logo fields when switching to design service
                                        ...(opt === "design" ? { logoFile: null, logoPreview: null, logoUrl: null, logoUploading: false } : {}),
                                        // Clear design brief fields when switching to upload
                                        ...(opt === "upload" ? { designBrief: "", referenceImageFile: null, referenceImagePreview: null, referenceImageUrl: null, referenceImageUploading: false } : {}),
                                    }));
                                }}
                                onUpload={(file) => {
                                    const preview = URL.createObjectURL(file);
                                    setSelections((s) => ({ ...s, logoFile: file, logoPreview: preview, logoUrl: null, logoUploading: true }));
                                    uploadToCloudinary(file)
                                        .then((url) => setSelections((s) => ({ ...s, logoUrl: url, logoUploading: false })))
                                        .catch((err) => {
                                            console.error("Logo pre-upload failed:", err);
                                            setSelections((s) => ({ ...s, logoUploading: false }));
                                        });
                                }}
                                onRemove={() => setSelections((s) => ({ ...s, logoFile: null, logoPreview: null, logoUrl: null, logoUploading: false }))}
                                designBrief={selections.designBrief}
                                onDesignBriefChange={(text) => setSelections((s) => ({ ...s, designBrief: text }))}
                                referenceImagePreview={selections.referenceImagePreview}
                                referenceImageUploading={selections.referenceImageUploading}
                                onReferenceImageUpload={(file) => {
                                    const preview = URL.createObjectURL(file);
                                    setSelections((s) => ({ ...s, referenceImageFile: file, referenceImagePreview: preview, referenceImageUrl: null, referenceImageUploading: true }));
                                    uploadToCloudinary(file)
                                        .then((url) => setSelections((s) => ({ ...s, referenceImageUrl: url, referenceImageUploading: false })))
                                        .catch((err) => {
                                            console.error("Reference image upload failed:", err);
                                            setSelections((s) => ({ ...s, referenceImageUploading: false }));
                                        });
                                }}
                                onReferenceImageRemove={() => setSelections((s) => ({ ...s, referenceImageFile: null, referenceImagePreview: null, referenceImageUrl: null, referenceImageUploading: false }))}
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
                            <StepTip
                                totalPrice={totalPrice - selections.tipAmount}
                                tipAmount={selections.tipAmount}
                                onTipChange={(amount) => setSelections((s) => ({ ...s, tipAmount: amount }))}
                            />
                        )}
                        {step === 6 && (
                            <StepReview
                                selections={selections}
                                totalPrice={totalPrice}
                                onEdit={(s) => setStep(s)}
                                onCheckout={handleCheckout}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Fixed bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border px-3 py-2.5 shadow-[0_-8px_16px_rgba(0,0,0,0.06)]">
                <div className="max-w-xl mx-auto flex items-center gap-2">
                    {step > 0 && (
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            className="px-4 py-2.5 rounded-xl font-body font-semibold text-xs text-foreground bg-gray-100 hover:bg-gray-200 transition-smooth"
                        >
                            Back
                        </button>
                    )}
                    {step < 6 ? (
                        <button
                            onClick={() => {
                                setStep((s) => Math.min(6, s + 1));
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={!canContinue()}
                            className="flex-1 bg-black text-white hover:bg-[#222222] py-2.5 rounded-xl font-body font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-center"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting || !selections.variant}
                            className="flex-1 bg-black text-white hover:bg-[#222222] py-2.5 rounded-xl font-body font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-center"
                        >
                            {isSubmitting ? "Processing..." : `Checkout — $${totalPrice.toFixed(2)}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
