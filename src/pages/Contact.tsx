import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, Instagram } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-foreground/75 font-body text-lg max-w-xl mx-auto">
            We would love to hear from you. Drop us a line anytime.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-secondary border border-border rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-display font-bold text-navy text-xl mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground font-body">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm font-body bg-card focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm font-body bg-card focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm font-body bg-card focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-smooth resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-navy text-primary-foreground py-3 rounded-lg font-body font-semibold text-sm hover:bg-navy-dark transition-smooth"
                  >
                    Submit Now
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-3">Our Store</h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  SleekStamp creates distinctive, tailor-made stamps for crafting, branding, and personal flair. Each meticulously crafted design captures your unique vision, turning every impression into a memorable statement. From bold business logos to heartfelt personal touches, our custom stamps transform moments into lasting, one-of-a-kind expressions in a single press.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-navy mb-4">Get in Touch</h3>
                <p className="text-muted-foreground font-body text-sm mb-5">
                  Whether it's an inquiry, feedback, or just a hello — we'd love to hear from you! Reach us on WhatsApp, email, or Instagram.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:support@sleekstamp.com"
                    className="flex items-center gap-3 text-sm font-body text-charcoal hover:text-navy transition-smooth"
                  >
                    <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-navy" />
                    </div>
                    support@sleekstamp.com
                  </a>
                  <a
                    href="https://wa.me/12495010837"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-body text-charcoal hover:text-navy transition-smooth"
                  >
                    <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-navy" />
                    </div>
                    WhatsApp: +1 (249) 501-0837
                  </a>
                  <a
                    href="https://instagram.com/sleekstamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-body text-charcoal hover:text-navy transition-smooth"
                  >
                    <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-navy" />
                    </div>
                    @sleekstamp
                  </a>
                </div>
              </div>

              <div className="bg-cream border border-border rounded-xl p-6">
                <h3 className="font-display font-semibold text-navy mb-3">Our Policies</h3>
                <ul className="space-y-1.5">
                  {[
                    { label: "Privacy Policy", href: "https://sleekstamp.com/pages/privacy-policy" },
                    { label: "Shipping Policy", href: "https://sleekstamp.com/pages/shipping-policy" },
                    { label: "Terms of Service", href: "https://sleekstamp.com/pages/term-of-services" },
                    { label: "Refund Policy", href: "https://sleekstamp.com/pages/refund-policy" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-body text-muted-foreground hover:text-navy transition-smooth"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
