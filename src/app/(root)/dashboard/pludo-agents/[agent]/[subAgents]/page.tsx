'use client'
import React from 'react'
import { useParams } from 'next/navigation' 
import { agentsWithSubAgents } from '../components/agentData'
import { ChatInterface } from './components/ChatInterface/ChatInterface' 
type Params = { 
  subAgents? : string; 
  agent?: string;
  }
const page = () => { 
  const params = useParams<Params>(); 
  const subAgents = params?.subAgents || 'No SubAgent Found';   
  const mainagent = params?.agent || 'No Agent Found'; 
  const [Main_Agent, setMainAgent] = React.useState<string>();
  const [agent , setAgent] = React.useState<string>();
  React.useEffect(()=>{  
    try {
   if (mainagent) { 
    const MainAgent =  agentsWithSubAgents.find(Agent => Agent.name === mainagent)   
    setMainAgent(MainAgent?.image);
    const SubAgent = MainAgent?.subAgents.find(Subagent => Subagent.id === subAgents);
    setAgent(SubAgent?.name);
   } 
  } 
  catch(e) { 
    console.log(e);
  }
  },[mainagent]) 

  return (
    <div > 
     <ChatInterface botName={agent} botAvatar={Main_Agent} /> 
     
    </div>
  )
}

export default page
