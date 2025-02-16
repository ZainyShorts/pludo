import { integrations } from "../IntegrationData";

interface SelectedIntegrationProps {
  selectedId: string | null;
  open: boolean;
  onClose: () => void; // To close modal when needed
}

export function SelectedIntegration({ selectedId, open, onClose }: SelectedIntegrationProps) {
  if (!open) return null;

  const integration = integrations.find(int => int.id === selectedId);

  if (!integration || !integration.Modal) {
    return null;
  }

  const Modal = integration.Modal;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full">

        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
          ✕
        </button>
        <Modal />
      </div>
    </div>
  );
}
