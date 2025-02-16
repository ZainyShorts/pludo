"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download } from "lucide-react"
import useFetchHook from "@/hooks/apiCall"

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState("")
  const { fetchData } = useFetchHook()
  const [isLoading, setIsLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const generateReport = async () => {
    setIsLoading(true)
    setDownloadUrl(null)
    const data = {
      webLink: url,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PLUDO_SERVER}/openai/webAnalyzer`, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Correct MIME type for DOCX
        "Content-Type": "application/json", // Add this header
      },
      body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob(); 
      const Url = window.URL.createObjectURL(blob);
      setDownloadUrl(Url)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = "website-analysis.docx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    }
  }


  return (
    <div className="max-h-[80vh] bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 bg-[#1c0b2e] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-purple-200 mb-6">Website Analyzer</h1>

        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">
            Website URL
          </Label>
          <div className="flex space-x-2">
            <Input
              id="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow bg-[#36154a] border-[#4a1d6a] text-purple-200 placeholder-purple-400"
            />
            <Button
              onClick={generateReport}
              disabled={!url || isLoading}
              className="bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>

        {downloadUrl && (
          <div className="mt-6">
            <Button
              onClick={handleDownload}
              className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download  Report 
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

