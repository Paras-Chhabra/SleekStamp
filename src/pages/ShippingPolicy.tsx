import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex-1">
                <h1 className="font-display text-4xl font-bold text-navy mb-8">Shipping Policy</h1>
                <div className="prose max-w-none font-body text-charcoal space-y-6">
                    <p>At SleekStamp, we strive to provide you with the fastest and most reliable shipping possible.</p>
                    <h2 className="text-2xl font-bold">Processing Time</h2>
                    <p>Orders are generally processed and shipped within 1–3 business days of receiving your order and artwork approval.</p>
                    <h2 className="text-2xl font-bold">Shipping Rates & Estimates</h2>
                    <p>Shipping charges for your order will be calculated and displayed at checkout. We offer Free Shipping on all orders over $150.</p>
                    <h2 className="text-2xl font-bold">International Shipping</h2>
                    <p>We currently offer international shipping to select countries. Please contact us for a specific quote.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
