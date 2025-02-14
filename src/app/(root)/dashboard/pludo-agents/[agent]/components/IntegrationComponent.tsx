"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react" 
import { Modal } from "./Modal/IntegrationModal"  
import { integrations } from "./IntegrationData"
import { SelectedIntegration } from "./SelectedIntegration/SelectedIntegration"



export default function Integrations() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null)

  const handleIntegration = (id: string) => {
    setSelectedIntegrationId(id)
    setIsModalOpen(true)
  }

 
  
  return (
    <div className="min-h-auto  bg-black text-white p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-start mb-12 bg-gradient-to-r from-white to-purple-400 text-transparent bg-clip-text">
          Integrations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-white/5 border border-white/10 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:bg-opacity-20"
            >
              <integration.icon className="w-8 h-8 mb-4 text-purple-400" />
              <h2 className="text-lg font-semibold mb-2">{integration.name}</h2>
              <p className="text-gray-400 text-sm text-center mb-4">{integration.description}</p>
              <Button
                variant="outline"
                onClick={() => handleIntegration(integration.id)}
                className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white hover:text-white transition-all duration-300"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SelectedIntegration selectedId={selectedIntegrationId} />
      </Modal>
    </div>
  )
}

