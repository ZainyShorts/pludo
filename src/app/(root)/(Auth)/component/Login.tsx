'use client'
import React from 'react'
import { Descope } from '@descope/nextjs-sdk';
import { useRouter } from 'next/navigation';

const LoginComponent = () => {
  const router  = useRouter()


  return (
    <Descope
		flowId="sign-up-or-in"
		theme="light"
		onSuccess={() => {
      console.log('success')
      router.push('/dashboard')
		}}
		onError={() => {
      console.log("Error!")
		}}
    />
  )
}

export default LoginComponent