import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex-1">
                <h1 className="font-display text-4xl font-bold text-navy mb-8">Refund Policy</h1>
                <div className="prose max-w-none font-body text-charcoal space-y-6">
                    <p>We want you to be completely satisfied with your SleekStamp purchase. If there is an issue with your order, we are here to help.</p>
                    <h2 className="text-2xl font-bold">Custom Stamps</h2>
                    <p>Due to the personalized nature of our custom stamps, we generally do not accept returns unless the product is defective or an error was made on our part.</p>
                    <h2 className="text-2xl font-bold">Defects and Errors</h2>
                    <p>If your stamp is defective or we made a mistake with your customization, please contact us within 14 days of delivery for a free replacement or full refund.</p>
                    <h2 className="text-2xl font-bold">Refund Process</h2>
                    <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
