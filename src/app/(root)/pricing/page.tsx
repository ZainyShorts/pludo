import React from 'react'
import { FAQs } from './components/FAQs/FAQs'
import TestimonialSection from './components/Testimonial/Testimonial'
import FeaturesSection from './components/Features/Features'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'

export default function Pricing() {
  return ( 
    <>    
    <Navbar/>
    <div className='bg-gray-100 mt-20'> 
    <FeaturesSection/>
    <TestimonialSection/>
     
    <div className='flex flex-col items-center gap-4 justify-center p-4'> 
    <h1 className='font-bold text-2xl '> Frequently asked questions</h1>
      <FAQs/>
    </div>   
    </div> 
    <Footer/>
    </>

  )
}
