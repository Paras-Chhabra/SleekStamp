import { useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Star, ChevronRight, Check, ArrowLeft, ShoppingCart, Zap, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products as hardcodedProducts, Product } from "@/data/products";
import { useShopifyProducts } from "@/hooks/useShopify";
import { useCart } from "@/context/CartContext";

// ── Multi-Step Customizer ─────────────────────────────────────────────────────

type Step = "size" | "upload" | "pad" | "color" | "priority" | "review";

const stepLabels: Record<Step, string> = {
  size: "Choose Size",
  pad: "Add Stamp Pad",
  color: "Ink Color",
  upload: "Upload Logo",
  priority: "Processing",
  review: "Add to Cart",
};

interface CustomizerState {
  size: { label: string; size: string; price: number; variantId?: string } | null;
  stampPad: { label: string; price: number } | null;
  inkColor: string | null;
  logo: File | string | null;
  priority: boolean;
}

function Customizer({
  product,
  onComplete,
  initialState,
  isEditing,
}: {
  product: Product;
  onComplete: (state: CustomizerState) => void;
  initialState?: Partial<CustomizerState>;
  isEditing?: boolean;
}) {
  const isStampPad = product.category === "stamp-pad";
  const isCustomStamp = product.category === "custom-stamps";
  let STEPS: Step[] = isStampPad
    ? ["size", "color", "review"]
    : isCustomStamp
      ? ["size", "upload", "pad", "color", "priority", "review"]
      : ["review"];

  if (!product.sizes && isCustomStamp) {
    STEPS = STEPS.filter((s) => s !== "size");
  }

  const [stepIdx, setStepIdx] = useState(0);
  const [state, setState] = useState<CustomizerState>({
    size: initialState?.size ?? product.sizes?.[1] ?? null,
    stampPad: initialState?.stampPad ?? null,
    inkColor: initialState?.inkColor ?? product.inkColors?.[0] ?? null,
    logo: initialState?.logo ?? null,
    priority: initialState?.priority ?? false,
  });

  const step = STEPS[stepIdx];
  const totalSteps = STEPS.length;

  const padOptions = [
    { label: 'Small Pad (for 1"–2" stamps)', price: 7.99 },
    { label: 'Medium Pad (for 2"–3" stamps)', price: 9.99 },
    { label: 'Large Pad (for 3"+ stamps)', price: 12.99 },
  ];

  const inkColors = product.inkColors ?? ["Black", "Blue", "Red", "Green", "Purple"];
  const colorSwatches: Record<string, string> = {
    Black: "#1a1a1a",
    Blue: "#1e40af",
    Red: "#dc2626",
    Green: "#16a34a",
    Purple: "#7c3aed",
    Violet: "#6d28d9",
  };

  const basePrice = state.size?.price ?? product.price;
  const padPrice = state.stampPad?.price ?? 0;
  const priorityPrice = state.priority ? 4.99 : 0;
  const total = basePrice + padPrice + priorityPrice;

  const canNext = () => {
    if (step === "size") return !!state.size;
    return true;
  };

  const next = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
    else onComplete(state);
  };

  const back = () => setStepIdx((i) => Math.max(0, i - 1));

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6 lg:p-8 sticky top-24">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        {stepIdx > 0 ? (
          <button
            onClick={back}
            className="flex items-center gap-1 text-sm text-muted-foreground font-body hover:text-navy transition-smooth"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : (
          <div />
        )}
        <div className="text-xs font-body text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          Step {stepIdx + 1} of {totalSteps}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${((stepIdx + 1) / totalSteps) * 100}% ` }}
        />
      </div>

      {/* Step: Size */}
      {step === "size" && product.sizes && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Choose Your Size</h3>
          <p className="text-sm text-muted-foreground font-body mb-5">Select the size that fits your needs</p>
          <div className="grid grid-cols-2 gap-3">
            {product.sizes.map((sz) => (
              <button
                key={sz.label}
                onClick={() => setState((s) => ({ ...s, size: sz }))}
                className={`p - 4 rounded - xl border - 2 text - left transition - smooth
                  ${state.size?.label === sz.label
                    ? "border-gold bg-gold/5"
                    : "border-border hover:border-navy/40"
                  } `}
              >
                <div className="font-display font-bold text-base text-foreground mb-0.5">{sz.label}</div>
                <div className="text-xs text-muted-foreground font-body mb-1.5">{sz.size}</div>
                <div className="font-body font-semibold text-gold">${sz.price.toFixed(2)}</div>
                {state.size?.label === sz.label && (
                  <div className="mt-1.5">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Stamp Pad */}
      {step === "pad" && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-3">Add a Stamp Pad?</h3>

          <div className="mb-5 bg-gold/10 border border-gold/30 rounded-lg p-4">
            <h4 className="font-display font-semibold text-navy text-sm mb-1.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-gold fill-gold" />
              Why add a premium stamp pad?
            </h4>
            <p className="text-xs text-charcoal font-body leading-relaxed">
              Our professional-grade pads feature high-yield, fade-resistant ink specifically formulated to flow perfectly with our custom rubber. Ensure crisp, flawless impressions right out of the box by pairing your stamp with the exact ink it was designed for.
            </p>
          </div>

          <div className="space-y-3">
            {padOptions.map((pad) => (
              <button
                key={pad.label}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    stampPad: s.stampPad?.label === pad.label ? null : pad,
                  }))
                }
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-smooth shadow-sm
                  ${state.stampPad?.label === pad.label
                    ? "border-gold bg-gold/5 ring-1 ring-gold/20"
                    : "border-border hover:border-navy/40 bg-card"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-700 rounded" />
                  <span className="font-body text-sm font-medium text-foreground">{pad.label}</span>
                </div>
                <span className="font-body font-semibold text-gold text-sm">+${pad.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setState((s) => ({ ...s, stampPad: null })); next(); }}
            className="mt-4 w-full text-center text-sm text-muted-foreground font-body hover:text-navy transition-smooth underline underline-offset-2"
          >
            Skip this step →
          </button>
        </div>
      )}

      {/* Step: Ink Color */}
      {step === "color" && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Choose Ink Color</h3>
          <p className="text-sm text-muted-foreground font-body mb-5">Select one or more colors · $5.99 each additional</p>
          <div className="grid grid-cols-3 gap-3">
            {inkColors.map((color) => (
              <button
                key={color}
                onClick={() => setState((s) => ({ ...s, inkColor: color }))}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-smooth shadow-sm
                  ${state.inkColor === color ? "border-gold bg-gold/5 ring-1 ring-gold/20" : "border-border hover:border-navy/40 bg-card"}`}
              >
                <div
                  className="w-12 h-12 rounded-full shadow-md border-2 border-white"
                  style={{ backgroundColor: colorSwatches[color] ?? "#333" }}
                />
                <span className="font-body text-sm font-semibold text-foreground uppercase tracking-tight">
                  {color}
                  {(color === "Black" || color === "Blue") && (
                    <span className="block text-[10px] text-gold normal-case tracking-normal font-medium mt-0.5">Top Seller</span>
                  )}
                </span>
                {state.inkColor === color && <Check className="w-3.5 h-3.5 text-gold" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setState((s) => ({ ...s, inkColor: null })); next(); }}
            className="mt-4 w-full text-center text-sm text-muted-foreground font-body hover:text-navy transition-smooth underline underline-offset-2"
          >
            Skip this step →
          </button>
        </div>
      )}

      {/* Step: Upload Logo */}
      {step === "upload" && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Upload Your Logo</h3>
          <p className="text-sm text-muted-foreground font-body mb-5">Add a custom logo for your stamp</p>

          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-navy hover:bg-secondary/50 transition-smooth">
            <input
              type="file"
              accept="image/*"
              id="logo-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setState((s) => ({ ...s, logo: file }));
              }}
            />
            <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-2">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-body font-medium text-navy">Click to upload</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 5MB</span>
            </label>
            {state.logo && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {state.logo instanceof File ? state.logo.name : "Logo Select"}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setState((s) => ({ ...s, logo: null }));
                  }}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => { setState((s) => ({ ...s, logo: null })); next(); }}
            className="mt-4 w-full text-center text-sm text-muted-foreground font-body hover:text-navy transition-smooth underline underline-offset-2"
          >
            Skip this step →
          </button>
        </div>
      )}

      {/* Step: Priority Processing */}
      {step === "priority" && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Priority Processing</h3>
          <p className="text-sm text-muted-foreground font-body mb-5">Get your stamp in 24 hours instead of 3–5 business days</p>
          <div className="grid grid-cols-2 gap-3">
            {/* No Priority */}
            <button
              onClick={() => setState((s) => ({ ...s, priority: false }))}
              className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2
                ${!state.priority ? "border-gold bg-gold/5" : "border-border hover:border-navy/30"}`}
            >
              <span className="text-2xl">🐢</span>
              <span className="font-display font-bold text-sm text-foreground">Standard</span>
              <span className="text-xs text-muted-foreground font-body">3–5 business days</span>
              <span className="font-body font-semibold text-muted-foreground text-sm">Free</span>
              {!state.priority && <Check className="w-4 h-4 text-gold" />}
            </button>
            {/* Priority */}
            <button
              onClick={() => setState((s) => ({ ...s, priority: true }))}
              className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2
                ${state.priority ? "border-gold bg-gold/5" : "border-border hover:border-navy/30"}`}
            >
              <span className="text-2xl">⚡</span>
              <span className="font-display font-bold text-sm text-foreground">Priority</span>
              <span className="text-xs text-muted-foreground font-body">Within 24 hours</span>
              <span className="font-body font-semibold text-gold text-sm">+$4.99</span>
              {state.priority && <Check className="w-4 h-4 text-gold" />}
            </button>
          </div>
        </div>
      )}

      {/* Step: Review & Add to Cart */}
      {step === "review" && (
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-5">Review Your Order</h3>
          <div className="space-y-3 mb-5">
            {state.size && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">{state.size.label} ({state.size.size})</span>
                <span className="font-semibold text-foreground">${state.size.price.toFixed(2)}</span>
              </div>
            )}
            {state.stampPad && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">{state.stampPad.label}</span>
                <span className="font-semibold text-foreground">+${state.stampPad.price.toFixed(2)}</span>
              </div>
            )}
            {state.inkColor && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Ink Color: {state.inkColor}</span>
                <span className="font-semibold text-foreground">Included</span>
              </div>
            )}
            {state.logo && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Logo:</span>
                <span className="font-semibold text-foreground max-w-[150px] truncate">
                  {state.logo instanceof File ? state.logo.name : "Included"}
                </span>
              </div>
            )}
            {state.priority && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Priority Processing</span>
                <span className="font-semibold text-foreground">+$4.99</span>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between text-base font-body font-bold">
              <span>Total</span>
              <span className="text-navy">${total.toFixed(2)}</span>
            </div>
          </div>

          {!state.logo && isCustomStamp && (
            <div className="mt-4 mb-2 p-5 border border-destructive/30 bg-destructive/5 rounded-xl text-center shadow-inner">
              <p className="text-sm font-semibold text-destructive mb-3">A custom logo is required to proceed.</p>
              <input
                type="file"
                accept="image/*"
                id="review-logo-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setState((s) => ({ ...s, logo: file }));
                }}
              />
              <label htmlFor="review-logo-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-body font-medium hover:bg-secondary hover:text-navy transition-smooth shadow-sm">
                <Upload className="w-4 h-4 text-muted-foreground" />
                Upload Logo Now
              </label>
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      {step !== "review" ? (
        <button
          onClick={next}
          disabled={!canNext()}
          className="mt-6 w-full bg-gold text-accent-foreground py-3.5 rounded-xl font-body font-semibold text-base hover:bg-gold-dark transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => onComplete(state)}
          disabled={!state.logo && isCustomStamp}
          className="mt-2 w-full bg-navy text-primary-foreground py-3.5 rounded-xl font-body font-semibold text-base hover:bg-navy-light transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isEditing ? `Save Changes — $${total.toFixed(2)}` : `Add to Cart — $${total.toFixed(2)}`}
        </button>
      )}
    </div>
  );
}

// ── Main Product Detail Page ─────────────────────────────────────────────────

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  const { addItem, updateItem, items } = useCart();
  const { data: products = [], isLoading } = useShopifyProducts();

  const product = products.find((p) => p.slug === slug);

  // Find the cart item being edited (if any)
  const editingItem = editId ? items.find((i) => i.id === editId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
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
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy mb-3">Product Not Found</h2>
            <Link to="/products" className="text-gold font-body font-semibold hover:underline">
              Browse All Products →
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCustomizerComplete = (state: CustomizerState) => {
    const basePrice = state.size?.price ?? product.price;
    const padPrice = state.stampPad?.price ?? 0;
    const priorityPrice = state.priority ? 4.99 : 0;
    const total = basePrice + padPrice + priorityPrice;
    const variantId = state.size?.variantId ?? product.defaultVariantId;

    const itemData = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: total,
      quantity: editingItem?.quantity ?? 1,
      size: state.size?.size,
      inkColor: state.inkColor ?? undefined,
      stampPad: state.stampPad?.label,
      priorityProcessing: state.priority,
      logo: state.logo,
      variantId,
    };

    if (editId && editingItem) {
      updateItem(editId, itemData);
    } else {
      addItem(itemData);
    }

    navigate("/cart");
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-navy transition-smooth">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-navy transition-smooth">Stamps</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden border border-border shadow-card">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <div className="mt-3 flex gap-2">
                <span className={`inline - block text - xs font - body font - semibold px - 3 py - 1.5 rounded - full
                  ${product.badge === "Sale" ? "bg-destructive text-destructive-foreground" :
                    product.badge === "New" ? "bg-gold text-accent-foreground" :
                      "bg-navy text-primary-foreground"
                  } `}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Product Info + Customizer */}
          <div>
            {/* Info */}
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">
              {product.category.replace("-", " ")}
            </p>
            <h1 className="font-display text-3xl font-bold text-navy mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w - 4 h - 4 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"} `} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">
                {product.rating} · {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>

            <p className="text-muted-foreground font-body mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Features — only shown when product has features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-base text-foreground mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-body text-charcoal">
                      <Check className="w-4 h-4 text-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3 py-4 border-y border-border mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-body text-foreground font-medium">
                In Stock — Ships in {product.turnaround}
              </span>
            </div>

            {/* Customizer or direct Add to Cart */}
            <Customizer
              product={product}
              onComplete={handleCustomizerComplete}
              isEditing={!!editingItem}
              initialState={editingItem ? {
                size: editingItem.size && product.sizes
                  ? product.sizes.find(s => s.size === editingItem.size) ?? null
                  : null,
                inkColor: editingItem.inkColor ?? null,
                stampPad: editingItem.stampPad
                  ? { label: editingItem.stampPad, price: editingItem.stampPad.includes('Small') ? 7.99 : editingItem.stampPad.includes('Medium') ? 9.99 : 12.99 }
                  : null,
                logo: editingItem.logo ?? null,
                priority: editingItem.priorityProcessing ?? false,
              } : undefined}
            />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="flex gap-4 bg-card rounded-xl border border-border hover:border-gold/40 shadow-card hover:shadow-hover transition-smooth p-4"
                >
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-1 line-clamp-2">{p.name}</h4>
                    <p className="text-xs text-muted-foreground font-body mb-1.5">{p.shortDescription}</p>
                    <p className="font-body font-bold text-navy">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
