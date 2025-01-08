'use client'
import Link from 'next/link' 
import { useEffect , useState } from 'react';
import { Button } from "@/components/ui/button"
 

export default function Navbar() { 
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
    className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      isScrolled
        ? "bg-white/70 backdrop-blur-md"
        : "bg-white/70 backdrop-blur-md"
    }`}
  >      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-xl font-bold">
            Pludo
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/helpers" className="text-gray-600 hover:text-gray-900">
              Agents
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
            </Link>
            </Button>
            <Button>
            <Link href="/login" className="text-white ">
                Log In
            </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}