import { Button } from "@/components/ui/button"
import { AgentCard } from "./components/AgentCard"
import { Plus } from "lucide-react"

const agents = [
  {
    name: "Customer Support Bot",
    status: "active" as const,
    avatar: "/images/Avatars/Vera.png",
    queries: 1234,
  },
  {
    name: "Sales Assistant",
    status: "inactive" as const,
    avatar: "/images/Avatars/Sage.png",
    queries: 856,
  },
  {
    name: "Data Analyzer",
    status: "active" as const,
    avatar: "/images/Avatars/Delta.png",
    queries: 2145,
  },
]

export default function MyAgentsPage() {
  return (
    <div className="space-y-8 min-h-screen p-6 pt-24 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Agents</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Create New Agent
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard
            key={agent.name}
            name={agent.name}
            status={agent.status}
            avatar={agent.avatar}
            queries={agent.queries}
          />
        ))}
      </div>
    </div>
  )
}

