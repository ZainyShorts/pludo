"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card" 
import axios from "axios" 
import { useSession, useUser } from "@descope/nextjs-sdk/client"


export default function TemplateModal() { 
    const { user } = useUser()
      const ID = user?.userId
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleGetTemplates = async () => {
    if (!selectedFile) return

    const formData = new FormData();
    formData.append("file", selectedFile);
    
    // Log FormData content
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
    

    try {
      const response = await axios.post(`https://d57d-182-181-142-14.ngrok-free.app/openai/getBulkTemplates`,formData)
      
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-gradient-to-r from-[#1c0e29] to-[#160a27] border-none text-white">
      <CardContent className="p-6 space-y-4">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx"
          className="bg-[#36154a] border-[#4a1d6a] border-none text-white file:text-white file:bg-[#3d3654] hover:file:bg-[#4d466a] file:border-none"
        />

        <Select>
          <SelectTrigger className="w-full bg-[#36154a] border-[#4a1d6a] border-none text-white">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent className="bg-[#36154a] border-[#4a1d6a]border-none text-white"></SelectContent>
        </Select>

        <Textarea
          className="min-h-[200px] bg-[#36154a] border-[#4a1d6a] border-none text-white"
          placeholder="Template content will appear here..."
        />

        <Button className="w-full bg-purple-800 hover:bg-purple-900 text-white" onClick={handleGetTemplates}>
          Get Templates
        </Button>
      </CardContent>
    </Card>
  )
}

