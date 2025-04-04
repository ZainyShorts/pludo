"use client"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  chatbotName: string
  isDeleting: boolean
}

export function DeleteChatbotModal({ isOpen, onClose, onConfirm, chatbotName, isDeleting }: DeleteChatbotModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-purple-950 border-purple-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Delete Chatbot</DialogTitle>
          <DialogDescription className="text-purple-300">
            Are you sure you want to delete <span className="font-medium text-purple-200">{chatbotName}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-purple-600 bg-purple-900/30 hover:bg-purple-800/50 text-white"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

