import React from 'react'
import ContactPageForm from './component/ContactForm'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'

const page = () => {
  return (
    <>
    <Navbar/>
    <div className='bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900'>
        <ContactPageForm/>
    <Footer/>
    </div>
    </>
  )
}

export default page