"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Loader2, FileText } from "lucide-react"
import axios from "axios"

const url = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""

export default function FileComparisonModal() {
  const [files, setFiles] = useState<{ file1: File | null; file2: File | null }>({
    file1: null,
    file2: null,
  })
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [summary, setSummary] = useState<string>("")

  const fileInputRef1 = useRef<HTMLInputElement>(null)
  const fileInputRef2 = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [summary])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, fileKey: "file1" | "file2") => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      setIsUploading(true)
      setFiles((prev) => ({
        ...prev,
        [fileKey]: selectedFile,
      }))
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (fileKey: "file1" | "file2") => {
    setFiles((prev) => ({
      ...prev,
      [fileKey]: null,
    }))

    if (fileKey === "file1" && fileInputRef1.current) {
      fileInputRef1.current.value = ""
    } else if (fileKey === "file2" && fileInputRef2.current) {
      fileInputRef2.current.value = ""
    }
  }

  const triggerFileInput = (fileKey: "file1" | "file2") => {
    if (fileKey === "file1") {
      fileInputRef1.current?.click()
    } else {
      fileInputRef2.current?.click()
    }
  }

  const handleGenerateComparison = async () => {
    if (!files.file1 || !files.file2) {
      alert("Please upload both PDF files first")
      return
    }

    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("files", files.file1)
      formData.append("files", files.file2)

      const res = await axios.post(`${url}/openai/pdfFilesComparionSummary`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      const filteredSummary = res?.data?.data?.replace(/###/g, "").replace(/\*\*/g, "")
      setSummary(filteredSummary)

      setFiles({ file1: null, file2: null })

      if (fileInputRef1.current) {
        fileInputRef1.current.value = ""
      }
      if (fileInputRef2.current) {
        fileInputRef2.current.value = ""
      }
    } catch (error) {
      console.error("Error generating comparison:", error)
      setSummary("Error generating comparison. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const bothFilesSelected = files.file1 && files.file2

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm min-h-[350px] max-h-[550px]  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Document Comparison Generator</h2>

      <div className="mb-6 space-y-4">
        <div>
          <p className="text-purple-300 mb-2">Document 1</p>
          <input
            type="file"
            ref={fileInputRef1}
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e, "file1")}
            disabled={isUploading}
          />

          {!files.file1 ? (
            <div
              className="border-2 border-dashed border-[#3b1d59] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a2472] transition-colors"
              onClick={() => triggerFileInput("file1")}
            >
              <Upload className="h-8 w-8 text-purple-400 mb-4" />
              <p className="text-purple-300 text-center mb-2">Click to upload or drag and drop</p>
              <p className="text-purple-400/60 text-sm text-center">PDF only (Max 10MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#2a1541] border border-[#3b1d59] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-purple-400" />
                <span className="text-white truncate max-w-[300px]">{files.file1.name}</span>
              </div>
              <button
                className="bg-[#3b1d59]/50 hover:bg-[#3b1d59] rounded-full p-1.5 transition-colors"
                onClick={() => handleRemoveFile("file1")}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Second File Input */}
        <div>
          <p className="text-purple-300 mb-2">Document 2</p>
          <input
            type="file"
            ref={fileInputRef2}
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e, "file2")}
            disabled={isUploading}
          />

          {!files.file2 ? (
            <div
              className="border-2 border-dashed border-[#3b1d59] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a2472] transition-colors"
              onClick={() => triggerFileInput("file2")}
            >
              <Upload className="h-8 w-8 text-purple-400 mb-4" />
              <p className="text-purple-300 text-center mb-2">Click to upload or drag and drop</p>
              <p className="text-purple-400/60 text-sm text-center">PDF only (Max 10MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#2a1541] border border-[#3b1d59] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-purple-400" />
                <span className="text-white truncate max-w-[300px]">{files.file2.name}</span>
              </div>
              <button
                className="bg-[#3b1d59]/50 hover:bg-[#3b1d59] rounded-full p-1.5 transition-colors"
                onClick={() => handleRemoveFile("file2")}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        className="w-full py-6 text-lg font-semibold bg-[#3b1d59] hover:bg-[#4a2472] transition-colors text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        onClick={handleGenerateComparison}
        disabled={isUploading || isGenerating || !bothFilesSelected}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Generating Comparison...</span>
          </div>
        ) : (
          "Generate Comparison"
        )}
      </button>

      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Document Comparison</h3>
          <textarea
            ref={summaryRef}
            className="w-full h-[200px] p-3 bg-[#2a1541] text-white border border-[#3b1d59] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4a2472]"
            value={summary}
            readOnly
          />
        </div>
      )}
    </div>
  )
}

