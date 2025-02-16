"use client"

import Image from "next/image"
import { Edit, Share, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import axios from "axios"

interface AgentCardProps {
  id: string
  name: string
  avatar: string
  title: string
  description: string
  onDelete: (id: string) => void
}

export function AgentCard({ id, name, avatar, title, description, onDelete }: AgentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true) 
    console.log(id);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/custom/${id}`)
      if (res) {
        onDelete(id)
      }
    } catch (error) {
      console.error("Error deleting agent:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="relative overflow-hidden bg-white/5 backdrop-blur-xl w-full transition-all hover:shadow-lg hover:shadow-purple-500/10 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-50" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl">
              {avatar ? (
                <Image
                  src={avatar || "/placeholder.svg"}
                  alt={`${name}'s avatar`}
                  className="aspect-square object-cover"
                  fill
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">🤖</div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-xl mb-1">{name}</h3>
              <p className="text-sm text-zinc-400">{title}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-300">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 p-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 p-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loader"></span>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 p-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors"
          >
            <Share className="w-4 h-4 mr-2" />
            Deactivate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

