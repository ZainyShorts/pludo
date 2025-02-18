"use client"
import { Button } from "@/components/ui/button"
import { AgentCard } from "./components/AgentCard"
import { Plus, Loader2 } from "lucide-react"
import { useSession, useUser } from "@descope/nextjs-sdk/client"
import { Fetch_Custom_Agents } from "@/lib/query"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import Link from "next/link"

export default function MyAgentsPage() {
  const { user } = useUser()
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
  const { loading, error, data, refetch } = useQuery(Fetch_Custom_Agents, {
    variables: { userId: user?.userId },
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !isSessionLoading && user?.userId) {
      refetch()
    }
  }, [isAuthenticated, isSessionLoading, user?.userId, refetch])

  useEffect(() => {
    console.log("data", data, "load", loading, user?.userId)
  }, [data, loading, user?.userId])

  const customAgents = data?.getCustomAgent || []

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await refetch()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8 min-h-screen p-6 pt-10 bg-custom-gradient">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Agents</h1>
        <Link href="/create-agent">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Create New Agent
          </Button>
        </Link>
      </div>

      <div className="relative min-h-[200px]">
        {loading || isDeleting ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-white" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Error loading agents: {error.message}</div>
        ) : customAgents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customAgents.map((agent, index) => (
              <AgentCard
                key={index}
                id={agent._id}
                name={agent.name}
                avatar={agent.avatar}
                title={agent.title}
                description={agent.description}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-white text-center">No custom agents found. Create your first agent!</div>
        )}
      </div>
    </div>
  )
}

