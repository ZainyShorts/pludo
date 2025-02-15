"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Download } from "lucide-react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function EmailSummary() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [summary, setSummary] = useState(
    "Today's Email Summary:\n\n1. Meeting with client rescheduled to 3 PM\n2. Project deadline extended to next Friday\n3. New team member joining next week\n4. Quarterly report due by end of month\n5. Office potluck scheduled for next Thursday",
  )

  const handleClose = () => {
    // Implement close functionality here
    console.log("Close button clicked")
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `email_summary_${format(date || new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    // Here you would typically fetch the summary for the selected date
    // For this example, we'll just update the summary with the selected date
    if (newDate) {
      setSummary(
        `Email Summary for ${format(newDate, "MMMM d, yyyy")}:\n\n1. Sample item for selected date\n2. Another sample item\n3. Yet another sample item`,
      )
    }
  }

  return (
    <div className=" bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
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

        <Popover>
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
        </Popover>

        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="bg-[#36154a] border-[#4a1d6a] text-purple-100 placeholder-purple-300 min-h-[200px]"
          placeholder="No summary available for the selected date."
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
      </div>
    </div>
  )
}