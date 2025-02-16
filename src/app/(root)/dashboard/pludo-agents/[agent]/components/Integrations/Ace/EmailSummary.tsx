"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download, Loader2, Sparkles } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"

export default function EmailSummary() {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false); 
  

  const handleClose = () => {
    console.log("Close button clicked")
  }



  const handleGenerateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/getEmailSummary`)
      console.log("res", response)
      const sum = formatSummary(response.data.data)
      setSummary(sum)
    } catch (error) {
      console.error("Error fetching summary:", error)
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }

  const formatSummary = (text: any) => {
    return text.replace(/\*\*/g, "")
  }

  return (
    <div className="bg-transparent p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 ">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-purple-200 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            Email Summary
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-purple-200 hover:text-purple-100 hover:bg-[#36154a] rounded-full"
          >
            {/* <X className="h-6 w-6" /> */}
          </Button>
        </div>

      
        <div className="relative">
          <Textarea
            value={summary || ""}
            readOnly
            className="bg-[#36154a] border-[#4a1d6a] text-purple-100 placeholder-purple-300/50 min-h-[200px] rounded-xl p-4 text-lg resize-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />
          {!summary && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-purple-300/50 text-lg">Your Email summary will be shown here...</p>
            </div>
          )}
        </div>
        <Button
          onClick={handleGenerateSummary}
          className="w-full bg-gradient-to-r from-[#4a1d6a] to-[#6a2d9a] hover:from-[#5a2d7a] hover:to-[#7a3daa] text-white flex items-center justify-center gap-2 py-6 text-lg font-semibold rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Summary
            </>
          )}
        </Button>

      
      </div>
    </div>
  )
}

