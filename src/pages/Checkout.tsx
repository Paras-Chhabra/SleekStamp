import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

type CheckoutStep = "contact" | "shipping" | "payment" | "confirm";

const steps: { id: CheckoutStep; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirm", label: "Confirm" },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("contact");
  const [ordered, setOrdered] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const shipping = total >= 50 ? 0 : 5.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  const stepIdx = steps.findIndex((s) => s.id === step);

  const handlePlaceOrder = () => {
    setOrdered(true);
    clearCart();
  };

  if (ordered) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4 py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-navy mb-3">Order Confirmed!</h2>
            <p className="text-muted-foreground font-body mb-2">
              Thank you for your order. We've sent a confirmation to your email.
            </p>
            <p className="text-muted-foreground font-body mb-8">
              Your custom stamps will be ready in <span className="font-semibold text-navy">1–3 business days</span>.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-navy text-primary-foreground px-7 py-3.5 rounded-lg font-body font-semibold hover:bg-navy-light transition-smooth"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/products");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-smooth
                      ${i < stepIdx ? "bg-green-500 text-white" :
                        i === stepIdx ? "bg-navy text-primary-foreground" :
                          "bg-secondary text-muted-foreground"}`}
                  >
                    {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 font-body hidden sm:block ${i === stepIdx ? "text-navy font-semibold" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-px mx-2 ${i < stepIdx ? "bg-green-500" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border shadow-card p-6 lg:p-8">

                {/* Contact */}
                {step === "contact" && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-body font-medium text-foreground mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">First Name</label>
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => update("firstName", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">Last Name</label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => update("lastName", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping */}
                {step === "shipping" && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy mb-6">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-body font-medium text-foreground mb-1.5">Street Address</label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder="123 Main St"
                          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">City</label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) => update("city", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">State</label>
                          <input
                            type="text"
                            value={form.state}
                            onChange={(e) => update("state", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">ZIP Code</label>
                          <input
                            type="text"
                            value={form.zip}
                            onChange={(e) => update("zip", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">Country</label>
                          <select
                            value={form.country}
                            onChange={(e) => update("country", e.target.value)}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy transition-smooth"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                        </div>
                      </div>

                      {/* Shipping options */}
                      <div className="mt-2">
                        <h3 className="text-sm font-body font-semibold text-foreground mb-3">Shipping Method</h3>
                        <div className="space-y-2">
                          {[
                            { label: "Standard (3–5 business days)", price: shipping === 0 ? "FREE" : "$5.99" },
                            { label: "Expedited (1–2 business days)", price: "$12.99" },
                          ].map((opt) => (
                            <label key={opt.label} className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:border-navy/40 transition-smooth">
                              <div className="flex items-center gap-3">
                                <input type="radio" name="shipping" defaultChecked={opt.label.includes("Standard")} className="accent-navy" />
                                <span className="text-sm font-body text-foreground">{opt.label}</span>
                              </div>
                              <span className="text-sm font-body font-semibold text-navy">{opt.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment */}
                {step === "payment" && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy mb-6">Payment Information</h2>
                    <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground font-body">
                      <Lock className="w-3.5 h-3.5 text-green-500" />
                      <span>Your payment is secured with 256-bit SSL encryption.</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-body font-medium text-foreground mb-1.5">Card Number</label>
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={(e) => update("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body font-medium text-foreground mb-1.5">Name on Card</label>
                        <input
                          type="text"
                          value={form.cardName}
                          onChange={(e) => update("cardName", e.target.value)}
                          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            value={form.expiry}
                            onChange={(e) => update("expiry", e.target.value)}
                            placeholder="MM / YY"
                            maxLength={7}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-body font-medium text-foreground mb-1.5">CVV</label>
                          <input
                            type="text"
                            value={form.cvv}
                            onChange={(e) => update("cvv", e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-smooth"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm */}
                {step === "confirm" && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy mb-6">Review Your Order</h2>
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-body font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-body font-semibold text-sm text-navy">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-body font-bold text-base pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-navy">${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex gap-3 mt-8">
                  {stepIdx > 0 && (
                    <button
                      onClick={() => setStep(steps[stepIdx - 1].id)}
                      className="px-5 py-3 border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-secondary transition-smooth"
                    >
                      Back
                    </button>
                  )}
                  {step !== "confirm" ? (
                    <button
                      onClick={() => setStep(steps[stepIdx + 1].id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-navy text-primary-foreground py-3 rounded-lg font-body font-semibold text-sm hover:bg-navy-light transition-smooth"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 flex items-center justify-center gap-2 bg-gold text-accent-foreground py-3 rounded-lg font-body font-semibold text-base hover:bg-gold-dark transition-smooth"
                    >
                      <Lock className="w-4 h-4" />
                      Place Order — ${orderTotal.toFixed(2)}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div>
              <div className="bg-card rounded-2xl border border-border shadow-card p-5 sticky top-24">
                <h3 className="font-display font-bold text-base text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2.5 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 text-sm">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-foreground font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-body">×{item.quantity}</p>
                      </div>
                      <p className="font-body font-semibold text-xs text-navy shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>Subtotal</span><span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>Tax</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body font-bold text-sm pt-1.5 border-t border-border">
                    <span>Total</span><span className="text-navy">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
