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
  const [mainAgentName, setMainAgentName] = React.useState<string>('');
  const [agent , setAgent] = React.useState<string>('');
  React.useEffect(()=>{  
    try {
   if (mainagent) {  
    function formatAgentRole(role: string | undefined): string {
      if (!role) return '';
      return role.replace(/\s+/g, '_').toUpperCase();
  }
    const MainAgent =  agentsWithSubAgents.find(Agent => Agent.name === mainagent)   
    setMainAgent(MainAgent?.image);  
    const mainAgentRole = MainAgent?.role;
    const formattedRole = formatAgentRole(mainAgentRole);
    setMainAgentName(formattedRole);    const SubAgent = MainAgent?.subAgents.find(Subagent => Subagent.id === subAgents);
    setAgent(SubAgent?.name as string);
   } 
  } 
  catch(e) { 
    console.log(e);
  }
  },[mainagent]) 

  return (
    <div > 
     <ChatInterface
      botName={agent}
      botAvatar={Main_Agent}
      mainAgent={mainAgentName}
      /> 
     
    </div>
  )
}

export default page
