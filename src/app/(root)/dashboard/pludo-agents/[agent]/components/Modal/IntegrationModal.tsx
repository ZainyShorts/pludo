"use client"

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog" 
import { VisuallyHidden } from '@/components/visually-hidden'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>  
  <VisuallyHidden>
      <DialogTitle>Hidden Title</DialogTitle>
    </VisuallyHidden>      <DialogContent>
        <div>
          <button onClick={onClose}>X</button>
          <div>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
