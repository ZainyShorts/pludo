'use client'
import Link from 'next/link' 
import { useEffect , useState , useCallback } from 'react'; 
import Image from 'next/image';
import { Button } from "@/components/ui/button" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSession 
  , useUser , useDescope
 } from '@descope/nextjs-sdk/client';

export default function Navbar() { 
  const [isScrolled, setIsScrolled] = useState(false);
  const sdk = useDescope();
  const { isAuthenticated 
    // ,isSessionLoading 
     } = useSession();
 
	const { user  } = useUser(); 
  
  const handleLogout = useCallback(() => {
		sdk.logout();
	}, [sdk])
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
            <Link href="/agents" className="text-gray-600 hover:text-gray-900">
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
            {!isAuthenticated && 
            <Button>
            
               <Link href="/login" className="text-white ">
                Log In
            </Link> 
            </Button> 
}
            

<div>
          {isAuthenticated &&
        
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Image src={user?.picture || "/images/Avatars/Avatar2.png" }
          alt='user'
          width={40}
          height={40}
          className='rounded-full cursor-pointer'
          />
  </DropdownMenuTrigger>
  <DropdownMenuContent >
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>Logout</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>
           
          // <Link className='hover:scale-105 cursor-pointer hover:text-primary' href={'/sign-in'} >Login</Link>

         
          }
            </div>
            
            
          </div>
        </div>
      </div>
    </nav>
  )
}