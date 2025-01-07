import React from 'react'
import ContactPageForm from './component/ContactForm'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'

const page = () => {
  return (
    <>
    <Navbar/>
    <div className='mt-24'>
        <ContactPageForm/>
    </div>
    <Footer/>
    </>
  )
}

export default page