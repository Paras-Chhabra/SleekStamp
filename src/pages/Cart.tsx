import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShoppingCart, Pencil, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { createShopifyCheckout } from "@/utils/shopify";

export default function Cart() {
  const { items, total, itemCount, removeItem, updateQuantity, updateItem } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-9 h-9 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-navy mb-3">Your Cart is Empty</h2>
            <p className="text-muted-foreground font-body mb-6">
              Browse our collection and find the perfect stamp for your needs.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-navy text-primary-foreground px-6 py-3 rounded-lg font-body font-semibold hover:bg-navy-light transition-smooth"
            >
              Browse Stamps <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shipping = total >= 150 ? 0 : 5.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground font-body hover:text-navy transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
          <span className="text-muted-foreground">/</span>
          <h1 className="font-display text-2xl font-bold text-navy">
            Your Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-card rounded-xl border border-border p-4 shadow-card"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1 line-clamp-2">{item.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-3">
                    {item.size && (
                      <span className="text-xs text-muted-foreground font-body">Size: {item.size}</span>
                    )}
                    {item.inkColor && (
                      <span className="text-xs text-muted-foreground font-body">Color: {item.inkColor}</span>
                    )}
                    {item.stampPad && (
                      <span className="text-xs text-muted-foreground font-body">Pad: included</span>
                    )}
                    {item.logo && (
                      <div className="flex items-center gap-2 mt-2 w-full">
                        <span className="text-xs text-muted-foreground font-body">Logo:</span>
                        {item.logo instanceof File ? (
                          <div className="w-12 h-12 bg-secondary rounded overflow-hidden border border-border">
                            <img
                              src={URL.createObjectURL(item.logo)}
                              alt="Uploaded Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-body">Included</span>
                        )}
                      </div>
                    )}
                    {item.priorityProcessing && (
                      <span className="text-xs text-gold font-body font-medium">⚡ Priority Processing</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-secondary transition-smooth"
                      >
                        <Minus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <span className="px-3 text-sm font-body font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-secondary transition-smooth"
                      >
                        <Plus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-body font-bold text-navy">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Link
                        to={`/products/${item.slug || item.productId.split('/').pop()}?editId=${item.id}`}
                        className="p-1.5 border border-amber-400 text-amber-600 hover:bg-amber-50 transition-smooth rounded"
                        title="Edit item"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 border border-red-500 text-red-600 hover:bg-red-50 transition-smooth rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Logo upload requirement for skipped items */}
            {items.some((item) => item.logo === 'skipped') && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="font-body font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-600" />
                  Upload Your Design
                </h3>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  Please upload your logo/design for the following items before checking out:
                </p>
                <div className="space-y-3">
                  {items.filter((item) => item.logo === 'skipped').map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg border border-border p-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-white text-xs font-body font-semibold rounded-lg hover:opacity-90 transition-smooth">
                        <Upload className="w-3 h-3" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateItem(item.id, { logo: file });
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free shipping progress */}
            {shipping > 0 && (
              <div className="bg-cream rounded-xl border border-border p-4">
                <p className="text-sm font-body text-foreground mb-2">
                  Add <span className="font-semibold text-navy">${(150 - total).toFixed(2)}</span> more to get free shipping!
                </p>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{ width: `${Math.min((total / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-xl border border-border shadow-card p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-foreground mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-body font-bold text-base">
                  <span>Order Total</span>
                  <span className="text-navy">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    setIsCheckingOut(true);
                    const url = await createShopifyCheckout(items);
                    window.location.href = url;
                  } catch (e: any) {
                    console.error(e);
                    alert(e.message || "Failed to create checkout session. Please try again.");
                    setIsCheckingOut(false);
                  }
                }}
                disabled={isCheckingOut || items.length === 0 || items.some((item) => item.logo === 'skipped')}
                className="w-full flex items-center justify-center gap-2 bg-gold text-accent-foreground py-3.5 rounded-xl font-body font-semibold text-base hover:bg-gold-dark transition-smooth disabled:opacity-50"
              >
                {isCheckingOut ? (
                  "Preparing Checkout..."
                ) : items.some((item) => item.logo === 'skipped') ? (
                  <>Upload all designs to continue</>
                ) : (
                  <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="mt-4 space-y-2">
                {["SSL Secure Checkout", "Free Returns within 30 days", "100% Satisfaction Guarantee"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <span className="text-green-500">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
