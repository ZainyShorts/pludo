'use client'
import Image from 'next/image' 
import { useState , useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Robots from './components/RobotsSection/Robots'
import Footer from '@/app/components/Footer/Footer'
import Features from './components/Features/Features'
import Integrations from './components/Integrations/Integration'

import BentoTilt  from './components//UIDesignLayouts/BentoTilt'
import FloatingImage  from './components//UIDesignLayouts/Story'

export default function Home() { 
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])
  return (
    <main>
      <Navbar />
     

      <div className="relative pt-24 min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-950 to-pink-800">
      {/* Enhanced Glassmorphism effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-pink-500/20 blur-[100px] transition-all duration-1000 ease-in-out" 
             style={{
               transform: isLoaded ? 'scale(1.2) translate(-10%, -10%)' : 'scale(0.8) translate(0%, 0%)',
               opacity: isLoaded ? 1 : 0,
             }}
        />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px] transition-all duration-1000 ease-in-out" 
             style={{
               transform: isLoaded ? 'scale(1.2) translate(10%, 10%)' : 'scale(0.8) translate(0%, 0%)',
               opacity: isLoaded ? 1 : 0,
             }}
        />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-900/20 blur-[120px] transition-all duration-1000 ease-in-out" 
             style={{
               transform: isLoaded ? 'scale(1.2) translate(-50%, -50%)' : 'scale(0.8) translate(-50%, -50%)',
               opacity: isLoaded ? 1 : 0,
             }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-8 text-center md:text-left order-2 md:order-1">
          <h2 className="space-y-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl transition-all duration-700 ease-out"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              }}>
            <div>Pludo AI</div>
            <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent">
              beauty of the
            </div>
            <div>
              metaverse <span className="text-pink-500">world</span>
            </div>
          </h2>
          <p className="mx-auto max-w-lg text-base text-white/70 sm:text-lg md:mx-0 transition-all duration-700 ease-out delay-300"
             style={{
               opacity: isLoaded ? 1 : 0,
               transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
             }}>
            Pludo AI delivers smart, customizable AI bots designed to enhance customer interactions, streamline workflows, and drive efficiency for businesses of all sizes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start transition-all duration-700 ease-out delay-500"
               style={{
                 opacity: isLoaded ? 1 : 0,
                 transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
               }}>
            <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-pink-500/30 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-black">
              <span className="relative z-10">Buy Now</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-pink-600 to-pink-500 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
            </button>
            <button className="group relative overflow-hidden rounded-full bg-transparent px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-pink-500/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-black">
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
              <div className="absolute inset-0 border-2 border-pink-500/50 rounded-full" />
            </button>
          </div>
        </div>

        {/* Enhanced Image Section with Glowing Effect */}
        <div className="relative mt-12 md:mt-0 transition-all duration-1000 ease-out delay-700 order-1 md:order-2 mb-8 md:mb-0"
             style={{
               opacity: isLoaded ? 1 : 0,
               transform: isLoaded ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.9)',
             }}>
          <div className="absolute inset-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 opacity-30 blur-3xl animate-pulse" />
          </div>
          <div className="relative aspect-square w-full flex items-center max-w-xl mx-auto rounded-full border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="absolute -right-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-pink-500/50 blur-3xl animate-pulse" />
            <div className="absolute -left-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-purple-500/50 blur-3xl animate-pulse" />
            <Image
              src="/images/Avatars/Hero.png"
              alt="Metaverse Avatar"
              width={600}
              height={600}
              className="relative z-10 rounded-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
            {/* Enhanced Decorative Elements */}
            <div className="absolute -right-2 top-10 h-5 w-5 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50 animate-ping" />
            <div className="absolute -left-2 bottom-20 h-4 w-4 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50 animate-ping" />
            <div className="absolute right-10 -bottom-2 h-6 w-6 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 animate-ping" />
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Elements */}
      <div className="absolute bottom-8 left-6 z-10 flex items-center gap-4 transition-all duration-700 ease-out delay-1000"
           style={{
             opacity: isLoaded ? 1 : 0,
             transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
           }}>
        <div className=" hidden md:flex  gap-3">
          <div className="h-3 w-3 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-white/20 backdrop-blur-sm" />
          <div className="h-3 w-3 rounded-full bg-white/20 backdrop-blur-sm" />
        </div>
      </div>

    
    </div>


      {/* <TextComponent/>   */}
      <div className='bg-custom-gradient'>
      <BentoTilt />
      <FloatingImage />
      <Robots/>   
      <Features/> 
      <Integrations/>
      <Footer/> 
      </div>
 
    </main>
  )
}

