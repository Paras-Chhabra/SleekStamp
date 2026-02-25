import { useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Star, ChevronRight, Check, ArrowLeft, ShoppingCart, Zap, Upload, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products as hardcodedProducts, Product } from "@/data/products";
import { useShopifyProducts } from "@/hooks/useShopify";
import { useCart } from "@/context/CartContext";
import { createShopifyCheckout } from "@/utils/shopify";

// ── Single-Page Customizer ────────────────────────────────────────────────────

interface CustomizerState {
  size: { label: string; size: string; price: number; variantId?: string } | null;
  stampPad: { label: string; price: number; variantId?: string } | null;
  inkColor: string | null;
  logo: File | string | null;
  priority: boolean;
}

function Customizer({
  product,
  allProducts,
  onComplete,
  initialState,
  isEditing,
}: {
  product: Product;
  allProducts: Product[];
  onComplete: (state: CustomizerState) => void;
  initialState?: Partial<CustomizerState>;
  isEditing?: boolean;
}) {
  const isStampPad = product.category === "stamp-pad";
  const isCustomStamp = product.category === "custom-stamps";
  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const hasColors = !!product.inkColors && product.inkColors.length > 0;

  // ── Fetch stamp pad products from Shopify for add-ons ──
  const stampPadProducts = allProducts.filter(p => p.category === "stamp-pad");

  // Build stamp pad options from Shopify data – 3 sizes (M, L, XL)
  const stampPadOptions = stampPadProducts
    .sort((a, b) => a.price - b.price)
    .map(p => ({
      label: p.name,
      sizeLabel: p.name.includes("M") ? "M" : p.name.includes("XL") ? "XL" : p.name.includes("L") ? "L" : p.name.split("–").pop()?.trim() || "Pad",
      price: p.price,
      variantId: p.defaultVariantId,
    }));

  // ── Fetch priority processing price from Shopify ──
  const priorityProduct = allProducts.find(p => p.name.toLowerCase().includes("priority processing"));
  const priorityPrice = priorityProduct?.price ?? 4.99;

  const inkColors = product.inkColors ?? ["Black", "Blue", "Red", "Green", "Purple"];
  const colorSwatches: Record<string, string> = {
    Black: "#1a1a1a",
    Blue: "#1e40af",
    Red: "#dc2626",
    Green: "#16a34a",
    Purple: "#7c3aed",
    Violet: "#6d28d9",
  };

  // Ink bottle add-on colors
  const inkBottleColors = [
    { color: "Black", label: "Top Seller" },
    { color: "Blue", label: "Top Seller" },
    { color: "Red", label: null },
    { color: "Green", label: null },
  ];

  const [state, setState] = useState<CustomizerState>({
    size: initialState?.size ?? product.sizes?.[0] ?? null,
    stampPad: initialState?.stampPad ?? null,
    inkColor: initialState?.inkColor ?? product.inkColors?.[0] ?? null,
    logo: initialState?.logo ?? null,
    priority: initialState?.priority ?? false,
  });

  const [selectedInkBottle, setSelectedInkBottle] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  const basePrice = state.size?.price ?? product.price;
  const padPrice = state.stampPad?.price ?? 0;
  const actualPriorityPrice = state.priority ? priorityPrice : 0;
  const total = basePrice + padPrice + actualPriorityPrice;

  // ── Filter stamp pads based on selected size ──
  // Stamp sizes and pads are both sorted by price (ascending).
  // Map by position: 1st size → 1st pad, 2nd size → 2nd pad, etc.
  // If user picked the "All Sizes" bundle or no size, show all pads.
  const filteredStampPadOptions = (() => {
    if (!state.size || !product.sizes) return stampPadOptions;
    // Find the index of the selected size in the product's sizes array
    const selectedIndex = product.sizes.findIndex(s => s.label === state.size?.label);
    // If "All Sizes" variant (usually last/extra), or not found, show all pads
    if (selectedIndex < 0 || state.size.label?.toLowerCase().includes('all')) return stampPadOptions;
    // Return only the matching pad by index, or all if index out of range
    if (selectedIndex < stampPadOptions.length) {
      return [stampPadOptions[selectedIndex]];
    }
    return stampPadOptions;
  })();

  // Check if upload is required
  const needsLogo = isCustomStamp || product.category === 'face-stamps' || product.category === 'wooden-stamps';
  const hasValidLogo = state.logo instanceof File;

  /* ── Section Number Counter ── */
  let sectionNum = 0;

  return (
    <div className="space-y-8">
      {/* ── 1. Select Size ── */}
      {hasSizes && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Select Size</h3>
          <div className={`grid gap-3 ${product.sizes!.length <= 3 ? `grid-cols-${product.sizes!.length}` : "grid-cols-3"}`}>
            {product.sizes!.map((sz) => (
              <button
                key={sz.label}
                onClick={() => setState((s) => ({ ...s, size: sz, stampPad: null }))}
                className={`p-4 rounded-xl border-2 text-center transition-smooth
                  ${state.size?.label === sz.label
                    ? "border-foreground bg-blue-50"
                    : "border-border hover:border-foreground/30 bg-white"
                  }`}
              >
                <div className="font-body font-semibold text-sm text-blue-600 mb-0.5">{sz.size}</div>
                <div className="text-xs text-muted-foreground font-body mb-1">
                  {sz.label.includes("4") ? "Standard" : sz.label.includes("6") ? "Large" : "Oversized"}
                </div>
                <div className="font-body font-bold text-foreground">${sz.price.toFixed(0)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. Upload Design ── */}
      {(isCustomStamp || product.category === "face-stamps" || product.category === "wooden-stamps") && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Upload Your Design <span className="text-red-500">*</span></h3>
          <div className="border-2 border-dashed border-border rounded-xl bg-gray-50 p-8 text-center hover:border-foreground/30 transition-smooth">
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
            {state.logo ? (
              <div className="flex flex-col items-center gap-3">
                {state.logo instanceof File ? (
                  <img
                    src={URL.createObjectURL(state.logo)}
                    alt="Uploaded design"
                    className="max-w-[200px] max-h-[160px] rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground text-sm">Preview</div>
                )}
                <label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 font-body font-medium hover:underline">
                  Change Image
                </label>
              </div>
            ) : (
              <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-border mb-2">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-body font-medium text-foreground">Click to upload</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 5MB</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Add-ons section ── */}
      {isCustomStamp && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Add-ons (Optional)</h3>

          {/* Why add an Ink Pad? */}
          <div className="mb-5 p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
            <h4 className="font-body font-semibold text-sm text-foreground mb-1.5 flex items-center gap-1.5">
              ✨ Why should you add an Ink Pad?
            </h4>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              Your custom stamp deserves the perfect ink pad. Our premium pads are precisely sized to match your stamp, ensuring every impression is crisp, even, and professional. No smudging, no mess — just flawless results straight out of the box. Save time and avoid the hassle of finding the right pad later.
            </p>
          </div>

          {/* Stamp Pad Sizes — from Shopify */}
          <div className="mb-5">
            <h4 className="font-body font-medium text-sm text-foreground mb-3">Stamp Pad</h4>
            <div className="border border-border rounded-xl divide-y divide-border bg-white">
              {filteredStampPadOptions.map((pad) => {
                const isSelected = state.stampPad?.label === pad.label;
                return (
                  <div
                    key={pad.label}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <div className="font-body font-medium text-sm text-foreground">{pad.sizeLabel} – Stamp Pad</div>
                      <div className="text-xs text-muted-foreground font-body">{pad.label}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-body text-muted-foreground">+${pad.price.toFixed(2)}</span>
                      <button
                        onClick={() => setState((s) => ({
                          ...s,
                          stampPad: isSelected ? null : { label: pad.label, price: pad.price, variantId: pad.variantId },
                        }))}
                        className={`relative w-11 h-6 rounded-full transition-smooth ${isSelected ? "bg-foreground" : "bg-gray-200"}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isSelected ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ink Bottle — 3 colors */}
          <div>
            <h4 className="font-body font-medium text-sm text-foreground mb-3">Ink Bottle</h4>
            <div className="flex flex-wrap gap-3">
              {inkBottleColors.map(({ color, label }) => (
                <button
                  key={color}
                  onClick={() => setSelectedInkBottle(prev => prev === color ? null : color)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 transition-smooth
                    ${selectedInkBottle === color ? "border-foreground bg-gray-50" : "border-border hover:border-foreground/30 bg-white"}`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-200"
                    style={{ backgroundColor: colorSwatches[color] ?? "#333" }}
                  />
                  <span className="font-body text-sm font-medium text-foreground">{color}</span>
                  {label && (
                    <span className="text-[10px] text-amber-600 font-medium">{label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Ink Color ── */}
      {hasColors && !isStampPad && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Ink Color</h3>
          <div className="flex flex-wrap gap-3">
            {inkColors.map((color) => (
              <button
                key={color}
                onClick={() => setState((s) => ({ ...s, inkColor: color }))}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 transition-smooth
                  ${state.inkColor === color ? "border-foreground bg-gray-50" : "border-border hover:border-foreground/30 bg-white"}`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: colorSwatches[color] ?? "#333" }}
                />
                <span className="font-body text-sm font-medium text-foreground">{color}</span>
                {(color === "Black" || color === "Blue") && (
                  <span className="text-[10px] text-amber-600 font-medium">Top Seller</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stamp Pad Color (if stamp pad product) ── */}
      {isStampPad && hasColors && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Ink Color</h3>
          <div className="flex flex-wrap gap-3">
            {inkColors.map((color) => (
              <button
                key={color}
                onClick={() => setState((s) => ({ ...s, inkColor: color }))}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 transition-smooth
                  ${state.inkColor === color ? "border-foreground bg-gray-50" : "border-border hover:border-foreground/30 bg-white"}`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: colorSwatches[color] ?? "#333" }}
                />
                <span className="font-body text-sm font-medium text-foreground">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Processing ── */}
      {isCustomStamp && (
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-4">{++sectionNum}. Processing</h3>
          <div className="border border-border rounded-xl bg-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-body font-medium text-sm text-foreground">Priority Processing</span>
                <div className="text-xs text-muted-foreground font-body">Skip the queue. Ships in 24h.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-body text-muted-foreground">+${priorityPrice.toFixed(2)}</span>
              <button
                onClick={() => setState((s) => ({ ...s, priority: !s.priority }))}
                className={`relative w-11 h-6 rounded-full transition-smooth ${state.priority ? "bg-foreground" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.priority ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Summary ── */}
      <div className="pt-4 border-t border-border">
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Order Summary</h3>
        <div className="bg-gray-50 rounded-xl border border-border p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm font-body">
            <span className="text-muted-foreground">{product.name}{state.size ? ` (${state.size.size})` : ''}</span>
            <span className="font-medium">${basePrice.toFixed(2)}</span>
          </div>
          {state.stampPad && (
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Stamp Pad – {state.stampPad.label}</span>
              <span className="font-medium">+${padPrice.toFixed(2)}</span>
            </div>
          )}
          {state.priority && (
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Priority Processing</span>
              <span className="font-medium">+${actualPriorityPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between font-body font-bold text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Warning if logo not uploaded */}
        {needsLogo && !hasValidLogo && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-body">
            ⚠️ Please upload your design before proceeding.
          </div>
        )}

        <button
          onClick={async () => {
            try {
              setIsBuying(true);
              onComplete(state);
            } catch (e: any) {
              console.error(e);
              alert(e.message || 'Failed to create checkout. Please try again.');
              setIsBuying(false);
            }
          }}
          disabled={isBuying || (needsLogo && !hasValidLogo)}
          className="w-full bg-gold text-accent-foreground py-4 rounded-xl font-body font-semibold text-base hover:bg-gold-dark transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBuying ? (
            'Preparing Checkout...'
          ) : (
            <><ArrowRight className="w-4 h-4" /> Buy Now — ${total.toFixed(2)}</>
          )}
        </button>
      </div>
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
  const { data, isLoading } = useShopifyProducts();
  const products = data?.display ?? [];
  const allProducts = data?.all ?? [];

  const product = products.find((p) => p.slug === slug);

  // Find the cart item being edited (if any)
  const editingItem = editId ? items.find((i) => i.id === editId) : null;

  // Get priority processing price from Shopify
  const priorityProduct = allProducts.find(p => p.name.toLowerCase().includes("priority processing"));
  const priorityPrice = priorityProduct?.price ?? 4.99;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-border/30 border-t-foreground rounded-full animate-spin"></div>
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
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">Product Not Found</h2>
            <Link to="/products" className="text-foreground font-body font-semibold hover:underline">
              Browse All Products →
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCustomizerComplete = async (state: CustomizerState) => {
    const variantId = state.size?.variantId ?? product.defaultVariantId;

    // Build line items for direct Shopify checkout
    const lineItems: any[] = [];

    // Main product
    const customAttributes: { key: string; value: string }[] = [];
    if (state.stampPad) customAttributes.push({ key: "Stamp Pad", value: state.stampPad.label });
    if (state.priority) customAttributes.push({ key: "Priority Processing", value: "Yes" });
    if (state.inkColor) customAttributes.push({ key: "Ink Color", value: state.inkColor });
    if (state.logo && typeof state.logo === "string") customAttributes.push({ key: "Logo", value: "Uploaded" });

    lineItems.push({
      variantId,
      quantity: 1,
      stampPad: state.stampPad?.label,
      priorityProcessing: state.priority,
      logo: state.logo,
    });

    // Add stamp pad as separate line item
    if (state.stampPad?.variantId) {
      lineItems.push({
        variantId: state.stampPad.variantId,
        quantity: 1,
      });
    }

    // Add priority processing as separate line item
    if (state.priority) {
      const priorityProduct = allProducts.find(p => p.name.toLowerCase().includes("priority processing"));
      if (priorityProduct?.defaultVariantId) {
        lineItems.push({
          variantId: priorityProduct.defaultVariantId,
          quantity: 1,
        });
      }
    }

    try {
      const checkoutUrl = await createShopifyCheckout(lineItems);
      window.location.href = checkoutUrl;
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to create checkout. Please try again.");
    }
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
          <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-foreground transition-smooth">Stamps</Link>
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
                <span className={`inline-block text-xs font-body font-semibold px-3 py-1.5 rounded-full
                  ${product.badge === "Sale" ? "bg-destructive text-destructive-foreground" :
                    product.badge === "New" ? "bg-foreground text-white" :
                      "bg-foreground text-white"
                  }`}>
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
            <h1 className="font-display text-3xl font-bold text-foreground mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">
                {product.rating} · {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>

            <p className="text-muted-foreground font-body mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-base text-foreground mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-body text-foreground/80">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
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

            {/* Customizer */}
            <Customizer
              product={product}
              allProducts={allProducts}
              onComplete={handleCustomizerComplete}
              isEditing={!!editingItem}
              initialState={editingItem ? {
                size: editingItem.size && product.sizes
                  ? product.sizes.find(s => s.size === editingItem.size) ?? null
                  : null,
                inkColor: editingItem.inkColor ?? null,
                stampPad: editingItem.stampPad
                  ? { label: editingItem.stampPad, price: 0 }
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
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="flex gap-4 bg-card rounded-xl border border-border hover:border-foreground/20 shadow-card hover:shadow-hover transition-smooth p-4"
                >
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-1 line-clamp-2">{p.name}</h4>
                    <p className="text-xs text-muted-foreground font-body mb-1.5">{p.shortDescription}</p>
                    <p className="font-body font-bold text-foreground">${p.price.toFixed(2)}</p>
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
