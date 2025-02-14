"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Calendar } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EmailScheduler() {
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [scheduleEmail, setScheduleEmail] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Form submitted", { scheduleEmail, date, time })
  }

  return (
    <div className="h-auto overflow-y-auto bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-[#1c0b2e] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-purple-200 mb-6">Compose Email</h1>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useFileUpload"
              checked={useFileUpload}
              onCheckedChange={(checked) => setUseFileUpload(!!checked)}
            />
            <Label htmlFor="useFileUpload" className="text-sm font-medium">
              Use file upload instead of textarea
            </Label>
          </div>

          {useFileUpload ? (
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-200 border-dashed rounded-lg cursor-pointer bg-[#36154a] hover:bg-[#4a1d6a] transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-purple-200" />
                  <p className="mb-2 text-sm text-purple-200">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-purple-300">XLSX files only</p>
                </div>
                <Input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={(e) => console.log(e.target.files)}
                />
              </Label>
            </div>
          ) : (
            <Textarea
              placeholder="Enter receivers' email addresses, separated by commas if more than one"
              className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200 min-h-[100px]"
              rows={4}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject
          </Label>
          <Input id="subject" placeholder="Enter email subject" className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-sm font-medium">
            Message Body
          </Label>
          <Textarea
            id="body"
            placeholder="Enter your message"
            className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200 min-h-[150px]"
          />
        </div>

        <h2 className="text-xl font-semibold text-purple-200 mt-6 mb-2">Schedule Email</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="scheduleEmail"
              checked={scheduleEmail}
              onCheckedChange={(checked) => setScheduleEmail(!!checked)}
            />
            <Label htmlFor="scheduleEmail" className="text-sm font-medium">
              Enable scheduling
            </Label>
          </div>

          {scheduleEmail && (
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal bg-[#36154a] border-[#4a1d6a] text-purple-200 hover:bg-[#4a1d6a] hover:text-purple-100",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1c0b2e] border-[#4a1d6a]">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-[#1c0b2e] text-purple-200"
                  />
                </PopoverContent>
              </Popover>

              <Select onValueChange={setTime}>
                <SelectTrigger className="w-[180px] bg-[#36154a] border-[#4a1d6a] text-purple-200">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c0b2e] border-[#4a1d6a]">
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`} className="text-purple-200">
                      {`${i.toString().padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white">
          {scheduleEmail ? "Schedule Email" : "Send Email"}
        </Button>
      </form>
    </div>
  )
}
