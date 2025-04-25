
import Nav from "@/components/Nav";
import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-grow py-10">
        <div className="automotive-container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-4">Last updated: April 5, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AE Engineering, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use our platform for your personal or business use.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
            <p>
              You may not use our platform for any illegal purpose or in any manner that could damage, disable, or impair our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please <Link to="/contact" className="text-primary underline">contact us</Link>.
            </p>
          </div>
          
          <div className="mt-10 pt-6 border-t">
            <Link to="/" className="text-primary flex items-center gap-2">
              <Car className="h-5 w-5" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
