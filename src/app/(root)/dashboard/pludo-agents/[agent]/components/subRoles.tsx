'use client'

import React, { useState, useEffect } from 'react'
import { agentsWithSubAgents } from './agentData'  
// import { FastAverageColor } from 'fast-average-color'
import { AgentWithSubAgents } from './agentData'
import { ChevronRight, BarChart2, Handshake, TrendingUp } from 'lucide-react'

interface Prop {
  name?: string
}

const SubRoles: React.FC<Prop> = ({ name }) => {
  const [details, setDetails] = useState<AgentWithSubAgents>() 
    // const [bgStartColor, setBgStartColor] = useState<string>('rgb(30, 30, 30)')
  

 useEffect(() => {
     if (!name) return
 
     const matchedAgent = agentsWithSubAgents.find(agent => agent.name === name)
     if (matchedAgent) {
       setDetails(matchedAgent)
       
      //  const fac = new FastAverageColor()
      //  fac.getColorAsync(matchedAgent.image)
      //    .then(color => {
      //      const [r, g, b] = color.value.slice(0, 3)
      //      const brighterColor = `rgb(${Math.min(r + 30, 255)}, ${Math.min(g + 30, 255)}, ${Math.min(b + 30, 255)})`
      //      setBgStartColor(brighterColor)
      //    })
      //    .catch(e => {
      //      console.log(e)
      //      setBgStartColor('rgb(60, 60, 60)') 
      //    })
     } else {
       
     }
   }, [name])
 
  const getIcon = (roleName: string) => {
    switch (roleName) {
      case 'Strategic Planning':
        return <BarChart2 className="w-8 h-8 text-emerald-400" />
      case 'Partnership Management':
        return <Handshake className="w-8 h-8 text-violet-400" />
      case 'Market Analysis':
        return <TrendingUp className="w-8 h-8 text-cyan-400" />
      default:
        return <ChevronRight className="w-8 h-8 text-violet-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-6xl font-bold mb-12 text-center bg-gradient-to-r from-white to-purple-900  text-transparent bg-clip-text">
          {details?.role || 'Role Details'}
        </h2>
        <div className="space-y-6">
          {details?.subAgents.map((role : any, index : number) => (
            <div
              key={index}
              className="group relative bg-gradient-to-r from-black via-violet-900/30 to-slate-900 rounded-xl p-8 
                        backdrop-blur-sm border border-white/10 shadow-2xl transform transition-all duration-500 
                        hover:scale-[1.02] hover:shadow-black hover:border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-violet-500/10 to-cyan-500/10 
                            rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    {getIcon(role.name)}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">{role.name}</h3>
                </div>
                <p className="text-lg text-gray-400 leading-relaxed pl-16">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubRoles

