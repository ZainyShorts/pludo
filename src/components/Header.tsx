import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--secondary-bg))] backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary text-2xl">
            <i className="fas fa-code"></i>
          </div>
          <Link href="/">
            <h1 className="text-xl font-bold cursor-pointer">Plado.ai</h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Home</span>
          </Link>
          <span onClick={() => window.location.href = "/#features"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Features</span>
          <span onClick={() => window.location.href = "/#process"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">How It Works</span>
          <span onClick={() => window.location.href = "/#pricing"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Pricing</span>
        </nav>
        
        <div>
          <Link href="/generator">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
        
        <button 
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[hsl(var(--secondary-bg))] border-b border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/">
              <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Home</span>
            </Link>
            <span onClick={() => window.location.href = "/#features"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Features</span>
            <span onClick={() => window.location.href = "/#process"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">How It Works</span>
            <span onClick={() => window.location.href = "/#pricing"} className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">Pricing</span>
            <Link href="/generator">
              <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
