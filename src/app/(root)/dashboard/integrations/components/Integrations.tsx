'use client'

import { Switch } from "@/components/ui/switch"
import { ArrowRight, Loader2 } from 'lucide-react' // Import Loader
import React from "react"
import { motion } from "framer-motion" 
import { gql , useQuery } from "@apollo/client"
import { GET_INTEGRATIONS } from "@/lib/query" 
import useFetchHook from "@/hooks/apiCall"
import IconBody from "../../components/icons/icons"
import { useEffect, useState } from "react" 
import ModalComponent from "./InputModal" 
import { useDescope, useSession, useUser } from '@descope/nextjs-sdk/client';

interface IntegrationCardProps {
  icon: React.ReactNode
  name: string
  isConnected: boolean
  onToggle: () => void
  description: string
} 

function IntegrationCard({ icon, name, isConnected, onToggle, description }: IntegrationCardProps) {   
  return (
    <motion.div
      className="relative min-h-[300px] overflow-hidden rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 p-8 flex flex-col gap-4 group transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-6">
        <div className="text-white/90 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500/50 to-pink-500/50 shadow-lg shadow-purple-500/20">  
    <IconBody iconName={icon} /> 
  </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">{name}</h3>
            <p className="text-white/60 text-lg">
              {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        <Switch
          checked={isConnected}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-gradient-to-r from-purple-500 to-pink-500 h-8 w-16 p-2"
        />
      </div>

      <p className="text-white/70 text-lg leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer group/link">
        <span className="text-sm font-medium">Learn more</span>
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </motion.div>
  )
}

export default function Integrations() {
  const [email, setEmail] = useState<any>('');  
  const [isOpen , setIsOpen] = useState<Boolean>(false);
  const [appCode, setAppCode] = useState<any>(''); 
  const [ID , setID] = useState<any>(''); 
  const [integrationData, setIntegrationData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const {fetchData} = useFetchHook();
  const { user } = useUser(); 
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();

  const { loading, error, data, refetch } = useQuery(GET_INTEGRATIONS, {
    skip:!isAuthenticated,
    variables: { deScopeId: user?.userId},
  });

  
  useEffect(() => {
    if(isAuthenticated && !isSessionLoading && user?.userId){
      refetch();
    }
  }, [isAuthenticated,isSessionLoading]);

  useEffect(() => {
    if ((!loading || !error) && data) {
      setIntegrationData(data.getIntegrations);
    }
  }, [data, loading, error]); 
   
  const handleSwitch = async ( status ? : boolean  , id ? : any) => {    
    if (status) { 
      setIsLoading(true);
    }
    const data  = { 
      Id:ID ? ID : id, 
      status: status ? false : true, 
      email : email, 
      appCode : appCode,
    }    
     try { 
    const res = await fetchData(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/integration/updateGmailStatus`,'POST',data);  

    if (res.success === true) {
        if (Array.isArray(integrationData)) {
            const index = integrationData.findIndex(int => int._id === id || int._id === ID);  
            setID(null);
            console.log(index);
    
            if (index !== -1) {
                const updatedData = integrationData.map((item, i) =>
                    i === index ? { ...item, isConnected: !item.isConnected } : item
                );
                setIsOpen(false);
                setIntegrationData(updatedData); 
                
            }
        } else {
            console.error("integrationData is not an array or is null.");
        } 
      
    }  
  } 
    finally{ 
      setIsLoading(false); 
        }
  }  
  const handleToggle = async (id : any , isConnected : boolean) => {    
    setID(id);  

     if (isConnected) { 
      handleSwitch(isConnected , id);
     } 
     else if (!isConnected) {
     setIsOpen(true) 
     }
  }
  const onClose = () => { 
    setIsOpen(false);
  }
    
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-950/50 to-pink-950/30"> 
     {isLoading && ( // Conditionally render the Loader
            <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/70 ">
              <Loader2 className="animate-spin text-white w-12 h-12" />
            </div>
          )}
      <div className="container mx-auto px-6 py-24">
        <motion.div 
          className="max-w-7xl mx-auto space-y-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4 text-center">
            <motion.h1 
              className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Integrations
            </motion.h1>
            <motion.p 
              className="text-white/60 text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect your favorite platforms to enhance your experience and streamline your workflow
            </motion.p>
          </div>
          
          <motion.div 
            className="grid gap-8 lg:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {integrationData && integrationData.map((integration:any, index:number) => (
              <motion.div
                key={integration.name} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <IntegrationCard
                  icon={integration.icon}
                  name={integration.name}
                  isConnected={integration.isConnected}
                  onToggle={()=>handleToggle(integration._id , integration.isConnected)}
                  description={integration.description}
                />    
             
              </motion.div> 
            ))} 
              {ID && isOpen &&
                <ModalComponent email={email} AppCode={appCode} setEmail={setEmail} setAppCode={setAppCode} onSubmit={handleSwitch} onClose={onClose}/>
                 }
          </motion.div>
         
        </motion.div>
      </div>
    </div>
  )
} 