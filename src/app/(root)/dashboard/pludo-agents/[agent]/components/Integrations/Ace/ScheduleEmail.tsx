"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailScheduler() {
  const [selectedOption, setSelectedOption] = useState<string | undefined>()
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>()
  const [scheduleTime, setScheduleTime] = useState<string | undefined>()

  const handleOptionChange = (value: string) => {
    setSelectedOption(value)
  }

  const handleDateChange = (date: Date | undefined) => {
    setScheduleDate(date)
  }

  const handleTimeChange = (time: string | undefined) => {
    setScheduleTime(time)
  }

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-[#1c0b2e] border-purple-400/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-200 text-center">Email Scheduler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select onValueChange={handleOptionChange}>
              <SelectTrigger className="w-full bg-[#36154a] border-[#4a1d6a] text-purple-200 rounded-xl">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c0b2e] text-white border-[#4a1d6a] rounded-xl">
                <SelectItem value="bulk">Bulk Emails (send up to 1000 emails at a time)</SelectItem>
                <SelectItem value="template">
                  Template Generator (generate and send up to 30 emails)
                </SelectItem>
              </SelectContent>
            </Select>

            {selectedOption && (
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={handleDateChange}
                  className="w-full text-white rounded-xl border border-[#4a1d6a]"
                />

                <Select onValueChange={handleTimeChange}>
                  <SelectTrigger className="w-full bg-[#36154a] border-[#4a1d6a] text-purple-200 rounded-xl">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c0b2e] border-[#4a1d6a] rounded-xl max-h-[200px] overflow-y-auto">
                    {Array.from({ length: 24 * 2 }, (_, i) => {
                      const hours = Math.floor(i / 2)
                      const minutes = (i % 2) * 30
                      const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
                      return (
                        <SelectItem key={i} value={time} className="text-purple-200">
                          {time}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <Button className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white rounded-xl transition-all duration-300 transform hover:scale-105">
                  Schedule {selectedOption === "bulk" ? "Bulk Emails" : "Template Generation"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

