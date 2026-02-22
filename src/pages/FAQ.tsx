import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: `All orders are processed within 1–3 business days.\n\nStandard Shipping Times:\n• USA & Canada: 5–14 days\n• Oceania: 5–10 days\n• Europe: 5–15 days\n• Latin America: 10–25 days\n• Rest of the World: 14–30 days`,
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes! We ship to most countries worldwide. International delivery times may vary depending on your location.",
  },
  {
    q: "What stamp sizes are available?",
    a: "We currently offer three stamp sizes:\n• 4 × 4 inch\n• 6 × 6 inch\n• 8 × 8 inch",
  },
  {
    q: "Is the ink safe?",
    a: "Absolutely — 100% safe. We use water-based ink that is environmentally friendly and gentle on your skin.",
  },
  {
    q: "How do I place an order?",
    a: "1. Select your stamp size and color from the dropdown menu.\n2. Click Upload to add your photo or design.\n3. Enter your desired text in the provided text box.\n4. Click Order Now!\n5. Click Checkout.\n6. Enter your details (Name, Mobile Number, Full Address).\n7. Click Continue to Shipping Method.\n8. Click Continue to Payment Method.\n9. Click Complete Order.\n\n🎉 That's it! Your order is successfully placed.",
  },
  {
    q: "What is your return policy?",
    a: "We maintain a strict no return and refund policy for custom-made products. However, if you are not satisfied with the final product, we will redo it for free.",
  },
  {
    q: "What if I don't like my artwork?",
    a: "No worries! You can request edits and we'll send it back for approval. We print only once you're happy. If you don't like the final product, we'll redo it for free.",
  },
  {
    q: "What file formats do you accept for uploads?",
    a: "We accept PNG, JPG, SVG, and PDF files. For best results, please upload high-resolution files (300 DPI or higher). Vector files (SVG, PDF) are preferred for logos.",
  },
  {
    q: "Can I use the stamp on different surfaces?",
    a: "Yes! Our stamps work well on paper, cardstock, cardboard, kraft paper, and fabric. For best results on non-porous surfaces, use a specialized ink pad.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-navy text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-primary-foreground/75 font-body text-lg max-w-xl mx-auto">
            Find answers to common questions about our products and services.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-gold/50"
              >
                <AccordionTrigger className="font-body font-semibold text-foreground hover:text-navy hover:no-underline text-left py-5">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground text-sm leading-relaxed whitespace-pre-line pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 bg-cream border border-border rounded-xl p-8 text-center">
            <h3 className="font-display text-xl font-bold text-navy mb-2">Still have questions?</h3>
            <p className="text-muted-foreground font-body mb-5">
              We're happy to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-navy text-primary-foreground px-6 py-2.5 rounded-lg font-body font-semibold text-sm hover:bg-navy-dark transition-smooth"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
