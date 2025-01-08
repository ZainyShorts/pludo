import React from 'react'
import TopHelpersComponent from './components/TopPart/TopHelpersComponent'  
import Agents from './components/Agents/BottomSectionRobots'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'

const help = () => {
  return (
    <>
    <Navbar/>
    <div className='bg-custom-gradient'>
        <TopHelpersComponent/> 
        <Agents/>
    <Footer/>
    </div>
    </>
  )
}

export default help