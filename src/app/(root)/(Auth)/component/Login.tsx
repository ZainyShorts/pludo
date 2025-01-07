'use client'

import { useState } from 'react'
import { z } from 'zod'

export default function LoginComponent() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailSchema = z.string().email('Please enter a valid email address')
    try {
      emailSchema.parse(email)
      return true
    } catch (error) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Email submitted:', email)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=" w-full h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black">
      <div className="container-fluid relative h-screen flex flex-col items-center justify-center px-4">
       
        <div className="relative z-10 w-full max-w-md rounded-lg bg-white/10 p-8 pt-20 backdrop-blur-xl border border-white/30 shadow-lg"> 
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Login</h2>
            <p className="text-sm text-gray-300">Continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 text-white space-y-4">
          <div>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    className="h-12 w-full rounded-md border border-gray-300 bg-gray-50 bg-opacity-50 text-white px-4 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 placeholder-white"
    disabled={isLoading}
  />
  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
</div>


            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-md bg-purple-600 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : 'Continue with email'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-300">
            New user?{' '}
            <a href="/signup" className="text-purple-600 hover:text-purple-700">
              Get Started
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 flex gap-6 text-sm text-gray-400">
          <p className='hidden  md:block'>© 2024 YourCompany</p>
          <a href="/terms" className="hover:text-white">Terms & Conditions</a>
          <a href="/privacy" className=" hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}
