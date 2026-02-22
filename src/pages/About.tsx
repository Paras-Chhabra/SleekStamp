import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About SleekStamp</h1>
          <p className="text-primary-foreground/75 font-body text-lg max-w-xl mx-auto">
            Distinctive, tailor-made stamps for crafting, branding, and personal flair.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-navy mb-6">Our Story</h2>
          <div className="space-y-5 font-body text-charcoal leading-relaxed text-base">
            <p>
              SleekStamp creates distinctive, tailor-made stamps for crafting, branding, and personal flair. Each meticulously crafted design captures your unique vision, turning every impression into a memorable statement.
            </p>
            <p>
              From bold business logos to heartfelt personal touches, our custom stamps transform moments into lasting, one-of-a-kind expressions in a single press. We believe that every stamp should be as unique as the person or business behind it.
            </p>
            <p>
              We work with artists, small business owners, offices, crafters, and families to produce stamps that are beautiful, functional, and built to last. Our advanced laser engraving technology ensures every design — no matter how detailed — comes out sharp and clear.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-navy mb-10 text-center">3 Easy Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Logo",
                desc: "Upload your logo or design file in high resolution for the best print quality.",
              },
              {
                step: "2",
                title: "Add Instructions",
                desc: "Provide specific instructions for placement, size, and any special requirements.",
              },
              {
                step: "3",
                title: "Place Order",
                desc: "Complete your order and we'll handle the rest with professional printing and fast delivery.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center bg-card border border-border rounded-xl p-8">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 font-display font-bold text-lg text-accent-foreground">
                  {step}
                </div>
                <h3 className="font-display font-semibold text-lg text-navy mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-navy mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Quality Craftsmanship", desc: "Every stamp is laser engraved with precision. We don't compromise on quality." },
              { title: "Customer Satisfaction", desc: "We print only once you're happy with your proof. If you're not satisfied, we'll redo it for free." },
              { title: "Eco-Friendly Ink", desc: "We use 100% water-based ink that is safe for your skin and gentle on the environment." },
              { title: "Fast Turnaround", desc: "Orders are processed within 1–3 business days. We ship worldwide." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-cream rounded-xl p-6 border border-border">
                <h3 className="font-display font-semibold text-navy mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Ready to Create Your Custom Stamp?</h2>
          <p className="text-primary-foreground/75 font-body mb-7 max-w-md mx-auto">
            Join thousands of happy customers. Free proof. Fast delivery. 100% satisfaction guaranteed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-8 py-3.5 rounded-lg font-body font-semibold text-base hover:bg-gold-dark transition-smooth shadow-lg"
          >
            Shop All Stamps <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
