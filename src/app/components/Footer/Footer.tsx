import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

interface Props {
  theme?: string;
}

export default function Footer({ theme }: Props) {
  const isLightTheme = theme === 'light';

  return (
    <footer className={`w-full py-12 md:py-16 lg:py-20 ${isLightTheme ? 'bg-white' : ''}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 pl-4 sm:pl-2 sm:grid-cols-3 gap-8 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="flex flex-col items-start col-span-1">
            <Link href="/" className={`flex items-center space-x-3 font-bold text-2xl ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              Pludo
            </Link>
            <div className={`mt-4 ${isLightTheme ? 'text-gray-600' : 'text-gray-100'}`}>
              <p>Copyright © 2025</p>
              <p>PlayOS, Inc.</p>
              <p>All rights reserved</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4">
            <h3 className={`text-base font-bold ${isLightTheme ? 'text-gray-900' : 'text-gray-300'}`}>Product</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Sintra Helpers
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Sintra X
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className={`text-base font-bold ${isLightTheme ? 'text-gray-900' : 'text-gray-300'}`}>Company</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                About Sintra
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Careers
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className={`text-base font-bold ${isLightTheme ? 'text-gray-900' : 'text-gray-300'}`}>Resources</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Affiliate
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Blog
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Money-Back Guarantee
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Support
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Login
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4 sm:col-start-3 lg:col-auto">
            <h3 className={`text-base font-bold ${isLightTheme ? 'text-gray-900' : 'text-gray-300'}`}>Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Privacy Policy
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Terms and Conditions
              </Link>
              <Link href="#" className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-100 hover:text-gray-300'} transition-colors`}>
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center gap-4 lg:flex-row lg:justify-end">
          <nav className="flex gap-4">
            <Link href="#" className={`${isLightTheme ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`}>
              <FaTwitter size={20} />
            </Link>
            <Link href="#" className={`${isLightTheme ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`}>
              <FaFacebookF size={20} />
            </Link>
            <Link href="#" className={`${isLightTheme ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`}>
              <FaInstagram size={20} />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

