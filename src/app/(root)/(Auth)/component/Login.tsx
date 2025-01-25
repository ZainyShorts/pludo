'use client'
import React from 'react'
import { Descope } from '@descope/nextjs-sdk';
import { useRouter } from 'next/navigation';
import { Add_User, Get_User } from '@/lib/query';
import { getUserTimezone } from '@/lib/methods';
import { useLazyQuery, useMutation } from '@apollo/client';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';


const LoginComponent = () => {
  const router  = useRouter()

  const [AddUser] = useMutation(Add_User());


  const [fetchData, { loading, data, error }] = useLazyQuery(Get_User());

 

  return (
    <Descope
		flowId="sign-up-or-in"
		theme="light"
		onSuccess={async (event:any) => {
      console.log(event)
      const detail = event?.detail
      const user = detail.user
      if(detail.firstSeen){
        await AddUser({
          variables: {
            addUserInput: {
              deScopeId: user.userId,
              username: user.name,
              email: user.email,
              timeZone:getUserTimezone()

            },
          },
        });
      }
      else{
        const data = await fetchData();
        console.log(data)
        if(data) return router.push('/dashboard')

      }
      router.push('/pricing')
		}}
		onError={() => {
      console.log("Error")
		}}
    />
  )
}

export default LoginComponent

