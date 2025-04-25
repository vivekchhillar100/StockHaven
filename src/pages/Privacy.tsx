
import Nav from "@/components/Nav";
import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <main className="flex-grow py-10">
        <div className="automotive-container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-4">Last updated: April 5, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to the AE Engineering Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our platform.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as your name, email address, and other account information. We also collect information about your interactions with our platform.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-primary underline">contact us</Link>.
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
