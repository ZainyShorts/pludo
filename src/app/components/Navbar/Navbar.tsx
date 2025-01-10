'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from 'lucide-react'
import { useSession, useUser, useDescope } from '@descope/nextjs-sdk/client'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const sdk = useDescope()
  const { isAuthenticated } = useSession()
  const { user } = useUser()
  
  const handleLogout = useCallback(() => {
    sdk.logout()
  }, [sdk])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/10 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Hamburger menu for mobile */}
          <motion.div 
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="icon">
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-200' : 'text-white'}`} />
            </Button>
          </motion.div>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link href="/" className={`text-xl font-bold text-center flex-grow md:flex-grow-0 ${isScrolled ? 'text-gray-200' : 'text-white'}`}>
              Pludo
            </Link>
          </motion.div>

          {/* Desktop menu items */}
          <div className="hidden md:flex items-center space-x-8">
            {['agents', 'pricing', 'blog', 'contact'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link 
                  href={`/${item}`} 
                  className={`${isScrolled ? 'text-gray-200' : 'text-white'} hover:text-gray-300 transition-colors duration-200`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            {!isAuthenticated && (
              <div className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    variant="outline"
                    className={`${isScrolled ? 'text-black border-gray-200' : 'text-black border-white'} transition-colors duration-200`}
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                </motion.div>
              </div>
            )}

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Image
                      src={user?.picture || "/images/Avatars/Avatar2.png"}
                      alt='user'
                      width={40}
                      height={40}
                      className='rounded-full cursor-pointer'
                    />
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

