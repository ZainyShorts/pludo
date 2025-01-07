import Image from 'next/image'
import Navbar from '../../components/Navbar/Navbar'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react' 
import TextComponent from './components/Text/Text'  
import Robots from './components/RobotsSection/Robots'
import Footer from '@/app/components/Footer/Footer'
export default function Home() { 
 
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex bg-custom-gradient   flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl mt-32 md:mt-40 mx-auto">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
  Pludo
</h1>

          <p className="text-3xl sm:text-4xl text-white/90 mb-8">
            Your first hires, on AI.
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="rounded-full"
          >
            Learn more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-16  relative w-full max-w-lg aspect-square">
        <Image
  src="/images/HeroImage.png"  
  alt="3D character with space helmet"
  width={600}
  height={600}
  priority
  className="animate-float"
/>


        </div>
      </div> 

      <TextComponent/>  
      <div className='bg-gradient-to-br from-blue-900 via-purple-900  to-pink-600'>
      <Robots/>  
      <Footer/>
      </div>
 
    </main>
  )
}

