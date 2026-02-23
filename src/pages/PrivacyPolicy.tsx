import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex-1">
                <h1 className="font-display text-4xl font-bold text-navy mb-8">Privacy Policy</h1>
                <div className="prose max-w-none font-body text-charcoal space-y-6">
                    <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from SleekStamp.</p>
                    <h2 className="text-2xl font-bold">Personal Information We Collect</h2>
                    <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
                    <h2 className="text-2xl font-bold">How Do We Use Your Personal Information?</h2>
                    <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
                    <h2 className="text-2xl font-bold">Sharing Your Personal Information</h2>
                    <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
