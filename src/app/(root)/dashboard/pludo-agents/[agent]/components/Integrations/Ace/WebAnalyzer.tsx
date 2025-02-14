"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download } from "lucide-react"

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState("")
  const [report, setReport] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateReport = async () => {
    setIsLoading(true)
    // This is a placeholder for the actual report generation logic
    // In a real application, you would make an API call here
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulating API call
    setReport(`Website Analysis Report for ${url}:
1. Domain: ${new URL(url).hostname}
2. Protocol: ${new URL(url).protocol.slice(0, -1)}
3. Page Title: Sample Page Title
4. Meta Description: This is a sample meta description for the analyzed website.
5. Number of Internal Links: 42
6. Number of External Links: 15
7. Total Images: 28
8. Page Load Time: 1.5 seconds
9. Mobile Friendly: Yes
10. SSL Certificate: Valid`)
    setIsLoading(false)
  }

  const downloadReport = () => {
    const element = document.createElement("a")
    const file = new Blob([report], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "website_analysis_report.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0A0118] to-[#36154a] text-purple-50 flex items-center justify-center p-4">
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

        {report && (
          <div className="space-y-4">
            <Label htmlFor="report" className="text-sm font-medium">
              Analysis Report
            </Label>
            <Textarea
              id="report"
              value={report}
              readOnly
              className="h-64 bg-[#36154a] border-[#4a1d6a] text-purple-200 placeholder-purple-400"
            />
            <Button
              onClick={downloadReport}
              className="w-full bg-[#4a1d6a] hover:bg-[#5a2d7a] text-white flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}