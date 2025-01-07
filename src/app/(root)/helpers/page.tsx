import React from 'react'
import TopHelpersComponent from './components/TopPart/TopHelpersComponent'
import Navbar from '@/app/components/Navbar/Navbar'
import BottomSectionRobots from './components/BottomPart/BottomSectionRobots'
import Footer from '@/app/components/Footer/Footer'

const help = () => {
  return (
    <>
    <Navbar/>
    <div>
        <TopHelpersComponent/>
        <BottomSectionRobots/>
    </div>
    <Footer/>
    </>
  )
}

export default help