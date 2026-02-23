import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex-1">
                <h1 className="font-display text-4xl font-bold text-navy mb-8">Terms of Service</h1>
                <div className="prose max-w-none font-body text-charcoal space-y-6">
                    <p>Welcome to SleekStamp. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.</p>
                    <h2 className="text-2xl font-bold">Use of Site</h2>
                    <p>You agree to use this site for lawful purposes only and in a way that does not infringe the rights of others or restrict their use of the site.</p>
                    <h2 className="text-2xl font-bold">Orders and Payment</h2>
                    <p>By placing an order, you are offering to purchase a product. All orders are subject to availability and confirmation of the order price.</p>
                    <h2 className="text-2xl font-bold">Intellectual Property</h2>
                    <p>The content on this site, including text, logos, and graphics, is the property of SleekStamp and is protected by copyright laws.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
