"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { useSession, useUser } from "@descope/nextjs-sdk/client"

export default function EmailInterface() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("") 
   const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
    const { user } = useUser()
    const ID = user?.userId
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!subject) newErrors.subject = "Subject is required."
    if (!body) newErrors.body = "Message body is required."
    if (!file) newErrors.file = "Please upload an XLSX file."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    const formDataObject = {
      type: 'File',
      subject: subject,
      body: body,
      receiver : file, 
      userId: ID
    };
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/email/bulkEmail`, formDataObject)
      console.log("res", res)
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Failed to send email:", error)
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error sending email: ${error.response.data.message || "Please try again."}`)
      } else {
        alert("Error sending email. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-6 ">
      <Card className="w-full max-w-4xl bg-transparent  border-0  ">
        <CardContent className="p-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-200">Send Emails in Bulk</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-gray-200">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={errors.subject ? "border-red-500" : "bg-[#36154a] border-[#4a1d6a] text-purple-200 file:bg-[#4a1d6a] file:text-purple-200 file:border-0"}
              />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
            </div>
            <div className="space-y-2 text-gray-200">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={errors.body ? "border-red-500" : "bg-[#36154a] border-[#4a1d6a] text-purple-200 file:bg-[#4a1d6a] file:text-purple-200 file:border-0"}
              />
              {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
            </div>
            <div className="space-y-2 text-gray-200">
              <Label htmlFor="file-upload ">Upload XLSX File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className={errors.file ? "border-red-500 text-gray-200" : "text-gray-200"}
              />
              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
            </div>
            <Button type="submit" className="w-full bg-purple-800 hover:bg-purple-900" disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

