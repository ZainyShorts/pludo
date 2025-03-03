"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Loader2, FileText } from "lucide-react"
import axios from "axios"

const url = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""

export default function FileSummaryModal() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [summary, setSummary] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      setIsUploading(true)
      setFile(selectedFile)
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleGenerateSummary = async () => {
    if (!file) {
      alert("Please upload a PDF file first")
      return
    }

    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post(`${url}/openai/pdfFileSummary`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }) 
      console.log('data',res)

      setSummary(res.data.data)

      setFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      setSummary("Error generating summary. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm min-h-[350px] max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Document Summary Generator</h2>

      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {!file ? (
          <div
            className="border-2 border-dashed border-[#3b1d59] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a2472] transition-colors"
            onClick={triggerFileInput}
          >
            <Upload className="h-12 w-12 text-purple-400 mb-4" />
            <p className="text-purple-300 text-center mb-2">Click to upload or drag and drop</p>
            <p className="text-purple-400/60 text-sm text-center">PDF only (Max 10MB)</p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-[#2a1541] border border-[#3b1d59] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-purple-400" />
              <span className="text-white truncate max-w-[300px]">{file.name}</span>
            </div>
            <button
              className="bg-[#3b1d59]/50 hover:bg-[#3b1d59] rounded-full p-1.5 transition-colors"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <button
        className="w-full py-6 text-lg font-semibold bg-[#3b1d59] hover:bg-[#4a2472] transition-colors text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        onClick={handleGenerateSummary}
        disabled={isUploading || isGenerating || !file}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Generating Summary...</span>
          </div>
        ) : (
          "Generate Summary"
        )}
      </button>

      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Document Summary</h3>
          <textarea
            className="w-full h-[200px] p-3 bg-[#2a1541] text-white border border-[#3b1d59] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4a2472]"
            value={summary}
            readOnly
          />
        </div>
      )}
    </div>
  )
}