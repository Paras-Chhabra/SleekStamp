import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1e1e1e] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <span className="text-accent-foreground font-display font-bold text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Sleek<span className="text-white/80">Stamp</span>
              </span>
            </div>
            <p className="text-sm text-white/60 font-body leading-relaxed mb-5">
              Premium custom stamps made in the USA. Trusted by 45,000+ businesses, professionals, and individuals.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-smooth text-white/70 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">Products</h4>
            <ul className="space-y-2.5">
              {[
                ["Big Custom Stamps", "/products?category=custom-stamps"],
                ["Wooden Stamps", "/products?category=wooden-stamps"],
                ["Face and Logo Stamps", "/products?category=face-stamps"],
                ["Stamp Pads", "/products?category=stamp-pad"],
                ["Refill Ink", "/products?category=refill-ink"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-smooth font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">Help & Info</h4>
            <ul className="space-y-2.5">
              {[
                ["Contact us", "/contact"],
                ["Privacy Policy", "/privacy-policy"],
                ["Shipping Policy", "/shipping-policy"],
                ["Term of Services", "/terms-of-service"],
                ["Refund Policy", "/refund-policy"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-white/60 hover:text-white transition-smooth font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60 font-body">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-white/80" />
                <a href="https://wa.me/12495010837" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-smooth">+1(249) 501-0837</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60 font-body">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-white/80" />
                <a href="mailto:support@sleekstamp.com" className="hover:text-white transition-smooth">support@sleekstamp.com</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60 font-body">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/80" />
                <span>30 N Gould St Ste R<br />Sheridan, Wyoming 82801</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 font-body">
            © 2024 SleekStamp. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/40 hover:text-white/70 transition-smooth font-body"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
