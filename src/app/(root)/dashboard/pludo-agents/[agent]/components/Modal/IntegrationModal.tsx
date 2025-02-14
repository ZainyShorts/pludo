"use client"

import React from 'react'
import { Dialog, DialogContent ,DialogTitle } from "@/components/ui/dialog" 
import { VisuallyHidden } from '@/components/visually-hidden'
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>  
     <VisuallyHidden>
      <DialogTitle>Hidden Title</DialogTitle>
    </VisuallyHidden>
      <DialogContent className={cn(
        "bg-gray-900 border-2 border-purple-500 rounded-lg shadow-lg",
        "p-0 overflow-hidden",
        "backdrop-blur-sm bg-opacity-90",
        "transition-all duration-300 ease-in-out",
        "dark:text-gray-100",
        "max-w-lg w-full",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
        className
      )}>
        <div className="relative w-full h-full">
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
