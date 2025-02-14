"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import type React from "react" 

export default function BulkEmail() {
  const [type, setType] = useState<"Text" | "File">("Text")
  const [emailAddresses, setEmailAddresses] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateEmails = (emails: string) => {
    const emailList = emails.split(",").map((email) => email.trim())
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailList.every((email) => emailRegex.test(email))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (type === "Text" && !emailAddresses) {
      newErrors.emailAddresses = "Email addresses are required."
    } else if (type === "Text" && !validateEmails(emailAddresses)) {
      newErrors.emailAddresses = "Invalid email format. Use comma-separated emails."
    }

    if (!subject) newErrors.subject = "Subject is required."
    if (!body) newErrors.body = "Message body is required."
    if (type === "File" && !file) newErrors.file = "Please upload an XLSX file."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formData = new FormData()
    formData.append("type", type)
    formData.append("subject", subject)
    formData.append("body", body)

    if (type === "Text") {
      formData.append("receiver", emailAddresses)
    } else {
      if (file) {
        formData.append("receiver", file)
      }
    }

    try {
      const res = await axios.post("https://c76f-39-49-22-31.ngrok-free.app/email/bulkEmail", formData)
      console.log("res", res)
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Failed to send email:", error)
      alert("Error sending email. Please try again.")
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-purple-200 mb-6">Send Email</h1>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useFileUpload"
              checked={type === "File"}
              onCheckedChange={(checked) => setType(checked ? "File" : "Text")}
            />
            <Label htmlFor="useFileUpload" className="text-sm font-medium">
              Use file upload instead of textarea
            </Label>
          </div>

          {type === "File" ? (
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
                  onChange={(e) => {
                    const uploadedFile = e.target.files?.[0]
                    if (uploadedFile && uploadedFile.name.endsWith(".xlsx")) {
                      setFile(uploadedFile)
                      setErrors((prev) => ({ ...prev, file: "" }))
                    } else {
                      setErrors((prev) => ({ ...prev, file: "Only XLSX files are allowed." }))
                      setFile(null)
                    }
                  }}
                />
              </Label>
            </div>
          ) : (
            <div>
              <Textarea
                placeholder="Enter receivers' email addresses, separated by commas"
                className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200 min-h-[100px]"
                rows={4}
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
              />
              {errors.emailAddresses && <p className="text-red-400 text-sm">{errors.emailAddresses}</p>}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject
          </Label>
          <Input
            id="subject"
            placeholder="Enter email subject"
            className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && <p className="text-red-400 text-sm">{errors.subject}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-sm font-medium">
            Message Body
          </Label>
          <Textarea
            id="body"
            placeholder="Enter your message"
            className="bg-[#36154a] border-[#4a1d6a] placeholder-purple-200 min-h-[150px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {errors.body && <p className="text-red-400 text-sm">{errors.body}</p>}
        </div>

        {type === "File" && errors.file && <p className="text-red-400 text-sm">{errors.file}</p>}

        <Button type="submit" className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white">
          Send Email
        </Button>
      </form>
    </div>
  )
}

