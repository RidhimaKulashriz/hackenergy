import { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import heroBackground from "@/assets/hero-background.jpg";
import featureCollaboration from "@/assets/feature-collaboration.png";
import featureCompete from "@/assets/feature-compete.png";
import featureInnovate from "@/assets/feature-innovate.png";

const VideoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src="https://drive.google.com/file/d/18mM9ntrjNFqhZuSKQxBmOTdp4vqc8klX/preview"
            width="100%"
            height="100%"
            allow="autoplay"
            allowFullScreen
            className="border-0"
            title="Product Introduction"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default function Landing() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return <div className="flex min-h-screen flex-col">
      {/* Skip to main content link for accessibility */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        {/* Hero Section */}
        <div id="main-content"></div>
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img src={heroBackground} alt="" className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Join 10,000+ innovators building the future</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Build Tomorrow's
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Solutions Today
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                CollabForge connects developers, designers, and innovators to create
                breakthrough solutions through collaborative hackathons and challenges.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/events">
                    Find a Hackathon
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg"
                  onClick={() => setIsVideoOpen(true)}
                >
                  Watch Intro
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/admin">Organize an Event</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Events Hosted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$2M+</div>
                  <div className="text-sm text-muted-foreground">Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Why Choose CollabForge?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to participate, organize, and judge world-class hackathons
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-hover p-8 rounded-2xl text-center space-y-4">
                <div className="mx-auto h-24 w-24 flex items-center justify-center">
                  <img src={featureCollaboration} alt="" className="h-full w-full object-contain animate-float" />
                </div>
                <h3 className="text-2xl font-bold">Collaborate</h3>
                <p className="text-muted-foreground">
                  Form teams, share ideas, and build together with talented individuals from around the world
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-hover p-8 rounded-2xl text-center space-y-4">
                <div className="mx-auto h-24 w-24 flex items-center justify-center">
                  <img src={featureCompete} alt="" className="h-full w-full object-contain animate-float" style={{
                  animationDelay: "0.5s"
                }} />
                </div>
                <h3 className="text-2xl font-bold">Compete</h3>
                <p className="text-muted-foreground">
                  Showcase your skills, compete for prizes, and gain recognition from industry leaders
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-hover p-8 rounded-2xl text-center space-y-4">
                <div className="mx-auto h-24 w-24 flex items-center justify-center">
                  <img src={featureInnovate} alt="" className="h-full w-full object-contain animate-float" style={{
                  animationDelay: "1s"
                }} />
                </div>
                <h3 className="text-2xl font-bold">Innovate</h3>
                <p className="text-muted-foreground">
                  Turn your ideas into reality with access to resources, mentors, and cutting-edge technology
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join our community and turn your ideas into reality
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/auth">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
}