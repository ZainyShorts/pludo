'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AgentDetails from './components/HeroSection';
import SubRoles from './components/subRoles';
import Integrations from './components/Integrations';

type Params = { 
  agent?: string;
};

const Page = () => {
  const params = useParams<Params>();
  const [agent, setAgent] = useState<string>('Not Defined');

  useEffect(() => {
    setAgent(params?.agent || 'Not Defined');
  }, [params]);

  return (
    <div>
      <AgentDetails name={agent} /> 
      <SubRoles name={agent}/> 
      <Integrations/>
    </div>
  );
};

export default Page;
