import React from 'react'
import { FAQs } from './components/FAQs/FAQs'
import FeaturesSection from './components/Features/Features'
import Navbar from '@/app/components/Navbar/Navbar' 
import PricingPlans from './components/Pricing/Pricing'
import Footer from '@/app/components/Footer/Footer'

export default function Pricing() {
  return ( 
    <>    
    <Navbar/>
    <div className=" bg-gradient-to-br from-blue-900 via-purple-900  to-pink-600 ">  
      <PricingPlans/>   
      <FeaturesSection/>
      {/* <TestimonialSection/> */}
     
      <div className="flex flex-col items-center gap-4 justify-center p-4"> 
        <h1 className="font-extrabold  text-center text-gray-100 text-3xl mb-4"> Frequently asked questions</h1>
        <FAQs/>
      </div>   
    <Footer />
    </div> 
    </>
  )
}
