
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Nav from "@/components/Nav";
import { useAuth } from "@/hooks/useAuth";
import { Car, ChevronRight, Shield, Users } from "lucide-react";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex justify-between items-center py-4">
        <Nav />
      </div>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section py-20">
          <div className="automotive-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animated-fade-in">
                AE Engineering
              </h1>
              <p className="text-xl mb-8 opacity-90 animated-fade-in" style={{ animationDelay: "0.2s" }}>
                The central portal for all automobile industry professionals
              </p>
              
              {/* Auth buttons or dashboard button based on auth state */}
              <div className="animated-fade-in flex justify-center gap-4" style={{ animationDelay: "0.4s" }}>
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg">
                      Go to Dashboard
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signin">
                      <Button variant="outline" size="lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="lg">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted">
          <div className="automotive-container">
            <h2 className="text-3xl font-bold text-center mb-12">Premium Employee Experience</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="dashboard-card p-6 animated-slide-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex justify-center mb-4">
                  <Car className="h-12 w-12 text-automotive-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Automobile Excellence</h3>
                <p className="text-muted-foreground text-center">
                  Join the leading automobile company in the industry with cutting-edge technology and premium service.
                </p>
              </div>
              
              <div className="dashboard-card p-6 animated-slide-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-automotive-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Team Collaboration</h3>
                <p className="text-muted-foreground text-center">
                  Connect with your colleagues, share insights, and drive sales performance together.
                </p>
              </div>
              
              <div className="dashboard-card p-6 animated-slide-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-automotive-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Secure Access</h3>
                <p className="text-muted-foreground text-center">
                  Your data is protected with state-of-the-art security measures and tracking systems.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="automotive-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Car className="h-5 w-5 text-automotive-red" />
              <p className="font-semibold">AE Engineering © 2025</p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
