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
      router.push('/pricing')
		}}
		onError={(err:any) => {
			console.log("Error!", err)
		}}
	/>
  )
}

export default LoginComponent