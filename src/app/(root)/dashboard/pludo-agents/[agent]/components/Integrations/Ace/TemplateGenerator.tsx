"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { useSession, useUser } from "@descope/nextjs-sdk/client"
import { Loader2 } from "lucide-react"

interface EmailTemplate {
  email: string
  subject: string
  body: string
}

export default function TemplateModal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [selectedEmail, setSelectedEmail] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
  const { user } = useUser()
  const ID = user?.userId

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  useEffect(() => {
    console.log("user", user)
  }, [user])

  const handleGetTemplates = async () => {
    if (!selectedFile) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/getBulkTemplates`, formData)
      const templates = response.data.data.emails
      setEmailTemplates(templates)
      if (templates.length > 0) {
        setSelectedEmail(templates[0].email)
        setSubject(templates[0].subject)
        setBody(templates[0].body)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeSubject = (value: string, email: string) => {
    setSubject(value)
    const updatedTemplates = emailTemplates.map((template) =>
      template.email === email ? { ...template, subject: value } : template,
    )
    setEmailTemplates(updatedTemplates)
  }

  const handleChangeBody = (value: string, email: string) => {
    setBody(value)
    const updatedTemplates = emailTemplates.map((template) =>
      template.email === email ? { ...template, body: value } : template,
    )
    setEmailTemplates(updatedTemplates)
  }

  const handleEmailSend = async () => {
    const data = {
      userId: ID,
      emailJson: emailTemplates,
    }
    console.log(data)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/email/sendTemplateEmails`, data)
      console.log(res)
    } catch (e) {
      console.error("Error sending emails:", e)
    }
  }

  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email)
    const selectedTemplate = emailTemplates.find((template) => template.email === email)
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject)
      setBody(selectedTemplate.body)
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-gradient-to-r p-2 from-[#1c0e29] to-[#160a27] border-none text-white">
      <CardContent className="p-8 space-y-4">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx"
          className="bg-[#36154a] border-[#4a1d6a] border-none text-white file:text-white file:bg-[#3d3654] hover:file:bg-[#4d466a] file:border-none"
        />
        {emailTemplates.length > 0 ? (
          <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white" onClick={handleEmailSend}>
            Send Emails
          </Button>
        ) : (
          <Button
            className="w-full bg-purple-800 hover:bg-purple-900 text-white"
            onClick={handleGetTemplates}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Templates...
              </>
            ) : (
              "Get Templates"
            )}
          </Button>
        )}

        <Select value={selectedEmail} onValueChange={handleEmailSelect} disabled={emailTemplates.length === 0}>
          <SelectTrigger className="w-full bg-[#36154a] border-[#4a1d6a] border-none text-white">
            <SelectValue placeholder="Select an email" />
          </SelectTrigger>
          <SelectContent className="bg-[#36154a] border-[#4a1d6a] border-none text-white">
            {emailTemplates.map((template, index) => (
              <SelectItem key={index} value={template.email}>
                {template.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={subject}
          onChange={(e) => handleChangeSubject(e.target.value, selectedEmail)}
          placeholder="Subject"
          className="bg-[#36154a] border-[#4a1d6a] border-none text-white"
        />

        <Textarea
          value={body}
          onChange={(e) => handleChangeBody(e.target.value, selectedEmail)}
          className="min-h-[200px] bg-[#36154a] border-[#4a1d6a] border-none text-white"
          placeholder="Email body"
        />
      </CardContent>
    </Card>
  )
}

