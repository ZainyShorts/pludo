"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { integrations } from "./IntegrationData" 
import { useRouter } from "next/navigation"
import { SelectedIntegration } from "./SelectedIntegration/SelectedIntegration" 

export default function Integrations({ name }: { name: string }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null)
  const [extractedAgent, setExtractedAgent] = useState<any>(null) 
  const router = useRouter();

  useEffect(() => {
    // Find the integration that matches the provided name
    if (name) {
      const matchedIntegration = integrations.find(
        (integration) => integration.name === name
      )

      if (matchedIntegration) {
        setExtractedAgent(matchedIntegration)
        console.log("Matched integration:", matchedIntegration)
      } else {
        console.log("No integration found with name:", name)
        setExtractedAgent(null)
      }
    }
  }, [name])

  const handleIntegration = (id: string , link? : string) => { 
    if (!link) {
    setSelectedIntegrationId(id)
    setIsModalOpen(true) 
    } 
    else  { 
      router.push(link);
    }
  }

  // If no agent is extracted, show a message or return null
  if (!extractedAgent) {
    return (
      <div className="min-h-auto bg-black text-white p-6 sm:p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-start mb-12 bg-gradient-to-r from-white to-purple-400 text-transparent bg-clip-text">
            Integrations
          </h1>
          <p className="text-white">No integration found with the name: {name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-auto bg-black text-white p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-start mb-12 bg-gradient-to-r from-white to-purple-400 text-transparent bg-clip-text">
          {extractedAgent.name} Integrations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {extractedAgent.subagents &&
            extractedAgent.subagents.map((subagent: any) => (
              <div
                key={subagent.id}
                className="bg-white/5 border border-white/10 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:bg-opacity-20 group py-8 relative transform hover:border-white/20 overflow-hidden"
              >
                <subagent.icon className="w-8 h-8 mb-4 text-purple-400" />
                <h2 className="text-lg font-semibold mb-2">{subagent.name}</h2>
                <p className="text-gray-400 text-sm text-center mb-4">{subagent.description}</p>
                <Button
                  variant="outline"
                  onClick={() => handleIntegration(subagent.id , subagent?.link)}
                  className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white hover:text-white transition-all duration-300"
                >
                  Start
                </Button>
              </div>
            ))}
        </div>
      </div>

      <SelectedIntegration
        selectedId={selectedIntegrationId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

