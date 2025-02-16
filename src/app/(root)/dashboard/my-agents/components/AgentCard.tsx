import Image from "next/image"
import { Edit, Share, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AgentCardProps {
  name: string
  status: "active" | "inactive"
  avatar: string
  queries: number
}

export function AgentCard({ name, avatar, status, queries }: AgentCardProps) {
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
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  status === "active" ? "text-green-400" : "text-zinc-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${status === "active" ? "bg-green-400" : "bg-zinc-400"}`} />
                {status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-400">Queries</p>
            <p className="text-3xl font-bold text-white tabular-nums">{queries.toLocaleString()}</p>
          </div>
          {/* <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-400">Accuracy</p>
            <p className="text-3xl font-bold text-white tabular-nums">{accuracy}%</p>
          </div> */}
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
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 p-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-colors"
          >
            <Power className="w-4 h-4 mr-2" />
            {status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

