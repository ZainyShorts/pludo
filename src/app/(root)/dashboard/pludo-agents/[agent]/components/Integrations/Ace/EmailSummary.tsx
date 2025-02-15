"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download } from "lucide-react"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import axios from "axios"
export default function EmailSummary() {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    console.log("Close button clicked")
  }

  const handleDownload = () => {
    if (!summary) return

    const element = document.createElement("a")
    const file = new Blob([summary], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `email_summary_${format(new Date(), "yyyy-MM-dd")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  } 
 

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/getEmailSummary`) 
      console.log('res',response);
      const sum = formatSummary(response.data.data);
      setSummary(sum);
    } catch (error) {
      console.error("Error fetching summary:", error)
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  } 
  const formatSummary = (text : any) => {
    return text.replace(/\*\*/g, ''); 
  };
  return (
    <div className="bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-[#1c0b2e] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-200">Email Summary</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-purple-200 hover:text-purple-100 hover:bg-[#36154a]"
          >
            {/* <X className="h-6 w-6" /> */}
          </Button>
        </div>

        {/* Date picker commented out as requested */}
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-[#36154a] border-[#4a1d6a] text-purple-200 hover:bg-[#4a1d6a] hover:text-purple-100",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1c0b2e] border-[#4a1d6a]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              className="bg-[#1c0b2e] text-purple-200"
            />
          </PopoverContent>
        </Popover> */}

        <Button
          onClick={handleGenerateSummary}
          className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Summary...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>

        {summary && (
          <>
            <Textarea
              value={summary}
              readOnly
              className="bg-[#36154a] border-[#4a1d6a] text-purple-100 placeholder-purple-300 min-h-[200px]"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleDownload}
                className="bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Summary
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

