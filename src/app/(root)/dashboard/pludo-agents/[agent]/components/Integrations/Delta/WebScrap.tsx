"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Loader2, Globe } from "lucide-react"
import axios from "axios"

export default function WebsiteScraperModal() {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [scrapedContent, setScrapedContent] = useState<string>("")
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const URL = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""

  useEffect(() => {
    if (scrapedContent && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [scrapedContent])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }
  const handleScrapeWebsite = async () => {
    if (!url) {
      alert("Please enter a website URL")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(
        `${URL}/openai/webscraping?url=${url}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )

      console.log("API Response:", response.data)

      if (response.data && response.data.success && response.data.data) {
        setScrapedContent(response.data.data)   
        const dataReq = { 
          text : "Static Data"
        }
        
        const downloadRes = await axios.post("https://7a37-182-181-139-129.ngrok-free.app/docx/download",dataReq) 
        console.log("Download API Response" , downloadRes)
      } else if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html>")) {
        setScrapedContent("Error: API returned HTML instead of JSON. Please check the API endpoint.")
      } else {
        setScrapedContent("No content found or error scraping the website.")
      }
    } catch (error) {
      console.error("Error scraping website:", error)
      setScrapedContent("Error scraping website. Please check the URL and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm min-h-[250px] max-h-[450px] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Website Content Scraper</h2>

      <div className="mb-6">
        <p className="text-purple-300 mb-2">Website URL</p>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Globe className="h-5 w-5 text-purple-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="w-full pl-10 pr-4 py-3 bg-[#2a1541] text-white border border-[#3b1d59] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a2472] placeholder-purple-400/60"
          />
        </div>
      </div>

      <button
        className="w-full py-4 text-lg font-semibold bg-[#3b1d59] hover:bg-[#4a2472] transition-colors text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        onClick={handleScrapeWebsite}
        disabled={isLoading || !url}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Scraping Website...</span>
          </div>
        ) : (
          "Scrape Website"
        )}
      </button>

      {scrapedContent && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Scraped Content</h3>
          <textarea
            ref={contentRef}
            className="w-full h-[150px] p-3 bg-[#2a1541] text-white border border-[#3b1d59] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4a2472] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50"
            value={scrapedContent}
            readOnly
          />
        </div>
      )}
    </div>
  )
}

