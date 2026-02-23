import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy text-primary-foreground text-center py-2 text-xs font-body tracking-wide">
        <span>🚀 Free Shipping on Orders Over $150 · Fast 1–3 Day Processing</span>
      </div>

      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-navy rounded flex items-center justify-center">
                <span className="text-gold font-display font-bold text-base">S</span>
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-navy tracking-tight">Sleek</span>
                <span className="font-display font-bold text-2xl text-gold tracking-tight">Stamp</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded font-body text-base font-medium transition-smooth hover:text-navy hover:bg-secondary
                      ${location.pathname === link.href.split("?")[0] && location.pathname !== "/"
                        ? "text-navy font-semibold"
                        : location.pathname === "/" && link.href === "/"
                          ? "text-navy font-semibold"
                          : "text-charcoal"}`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 bg-navy text-primary-foreground px-5 py-2.5 rounded font-body text-base font-medium hover:bg-navy-light transition-smooth"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-charcoal hover:text-navy transition-smooth"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href}
                    className="block px-3 py-2.5 font-body text-sm font-medium text-charcoal hover:text-navy hover:bg-secondary rounded transition-smooth"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
