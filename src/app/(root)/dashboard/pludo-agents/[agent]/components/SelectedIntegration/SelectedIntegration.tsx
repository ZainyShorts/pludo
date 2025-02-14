import { integrations } from "../IntegrationData"

interface SelectedIntegrationProps {
  selectedId: string | null
}

export function SelectedIntegration({ selectedId }: SelectedIntegrationProps) { 
  const integration = integrations.find(int => int.id === selectedId)

  if (!integration || !integration.Modal) {
    return null 
  }

  const Modal = integration.Modal;
  return <Modal />;
}
