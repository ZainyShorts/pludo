"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" 
import { toast } from 'react-toastify';
import { Textarea } from "@/components/ui/textarea" 
import { Upload, SendIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  recipients: string
  subject: string
  body: string
  scheduleDate?: Date
  scheduleTime?: string
  file?: File
}

export default function EmailScheduler() {
  const [useFileUpload, setUseFileUpload] = useState(false)

  const [scheduleEmail, setScheduleEmail] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    recipients: "",
    subject: "",
    body: "",
  })
  const [errors, setErrors] = useState<any>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev: any) => ({ ...prev, [name]: "" }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setErrors((prev: any) => ({ ...prev, file: "Please upload an XLSX file" }))
      } else {
        setFormData((prev) => ({ ...prev, file }))
        setErrors((prev: any) => ({ ...prev, file: "" }))
      }
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev : any) => ({ ...prev, scheduleDate: date }))
    setErrors((prev : any) => ({ ...prev, scheduleDate: "" }))
  }

  const handleTimeChange = (time: string | undefined) => {
    setFormData((prev: any) => ({ ...prev, scheduleTime: time }))
    setErrors((prev: any) => ({ ...prev, scheduleTime: "" }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!useFileUpload && !formData.recipients) {
      newErrors.recipients = "Recipients are required"
    }
    if (!formData.subject) {
      newErrors.subject = "Subject is required"
    }
    if (!formData.body) {
      newErrors.body = "Message body is required"
    }
    if (useFileUpload && !formData.file) {
      newErrors.file = "File is required"
    }
    if (scheduleEmail) {
      if (!formData.scheduleDate) {
        newErrors.scheduleDate = "Date is required"
      }
      if (!formData.scheduleTime) {
        newErrors.scheduleTime = "Time is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateForm()) {
      console.log("Form submitted", formData); 
      setFormData({  
        recipients: "",
        subject: "",
        body: "",  
      });
      toast("Your email has been scheduled successfully.");
     
    } else {
     toast('Error Submitting Data ');
    }
  }

  return (
    <div className="max-h-[82vh] bg-gradient-to-br from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4 overflow-hidden [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [-ms-overflow-style:none] [scrollbar-width:none]"> 
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#1c0b2e] p-8 rounded-2xl shadow-2xl border border-purple-400/20 backdrop-blur-sm [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <motion.h1
            className="text-3xl font-bold text-purple-200 mb-6 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Compose Email
          </motion.h1>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useFileUpload"
                checked={useFileUpload}
                onCheckedChange={(checked) => setUseFileUpload(!!checked)}
              />
              <Label htmlFor="useFileUpload" className="text-sm font-medium cursor-pointer">
                Use file upload instead of textarea
              </Label>
            </div>

            {useFileUpload ? (
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-400/50 border-dashed rounded-2xl cursor-pointer bg-[#36154a] hover:bg-[#4a1d6a] transition-all duration-300 ease-in-out"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-purple-200 animate-bounce" />
                    <p className="mb-2 text-sm text-purple-200">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-purple-300">XLSX files only</p>
                  </div>
                  <Input id="fileUpload" type="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
                </Label>
                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
              </div>
            ) : (
              <div>
                <Textarea
                  name="recipients"
                  placeholder="Enter receivers' email addresses, separated by commas if more than one"
                  className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-300 min-h-[100px] rounded-xl focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
                  rows={4}
                  value={formData.recipients}
                  onChange={handleInputChange}
                />
                {errors.recipients && <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>}
              </div>
            )}
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Enter email subject"
              className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-300 rounded-xl focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
              value={formData.subject}
              onChange={handleInputChange}
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Label htmlFor="body" className="text-sm font-medium">
              Message Body
            </Label>
            <Textarea
              id="body"
              name="body"
              placeholder="Enter your message"
              className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-300 min-h-[150px] rounded-xl focus:ring-purple-400 focus:border-purple-400 transition-all duration-300"
              value={formData.body}
              onChange={handleInputChange}
            />
            {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
          </motion.div>

          <motion.h2
            className="text-xl font-semibold text-purple-200 mt-8 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Schedule Email
          </motion.h2>

          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheduleEmail"
                checked={scheduleEmail}
                onCheckedChange={(checked) => setScheduleEmail(!!checked)}
              />
              <Label htmlFor="scheduleEmail" className="text-sm font-medium cursor-pointer">
                Enable scheduling
              </Label>
            </div>

            {scheduleEmail && (
              <div className="flex flex-col space-y-4">
                <div className="w-full">
                  <Calendar
                    mode="single"
                    selected={formData.scheduleDate}
                    onSelect={handleDateChange} 
                    className="w-full text-purple-200 rounded-xl border border-[#4a1d6a]"
                  />
                </div>
                {errors.scheduleDate && <p className="text-red-500 text-sm">{errors.scheduleDate}</p>}

                <div className="w-full">
                  <Select onValueChange={handleTimeChange} value={formData.scheduleTime}>
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
                </div>
                {errors.scheduleTime && <p className="text-red-500 text-sm">{errors.scheduleTime}</p>}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {scheduleEmail ? "Schedule Email" : "Send Email"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

