"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

const url = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""

export const uploadImageToAWS = async (file: File, setUploadProgress: (progress: number) => void): Promise<any> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.get(`${url}/aws/signed-url?fileName=${file.name}&contentType=${file.type}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const signedUrl = response.data.msg.url

    const uploadResponse = await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        }
      },
    })

    if (uploadResponse.status === 200) {
      return { awsUrl: signedUrl.split("?")[0], key: response.data.msg.key }
    } else {
      throw new Error("Failed to upload file")
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

export const deleteFromAWS = async (filename: string): Promise<void> => {
  try {
    const response = await axios.delete(`${url}/aws/${filename}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response) {
      return response.data
    } else {
      throw new Error("Failed to delete file")
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}

export default function TextExtract({ onClick }: any) {
  const [images, setImages] = useState<string[]>(["", "", ""])
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0, 0])
  const [isUploading, setIsUploading] = useState<boolean[]>([false, false, false])
  const [awsImageUrls, setAwsImageUrls] = useState<{ awsUrl?: string; key?: string }[]>([{}, {}, {}])
  const [extractedText, setExtractedText] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handleImageSelect = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      setIsUploading((prev) => {
        const newIsUploading = [...prev]
        newIsUploading[index] = true
        return newIsUploading
      })

      const updateProgress = (progress: number) => {
        setUploadProgress((prev) => {
          const newProgress = [...prev]
          newProgress[index] = progress
          return newProgress
        })
      }

      try {
        const awsResponse = await uploadImageToAWS(file, updateProgress)

        setAwsImageUrls((prev) => {
          const newAwsImageUrls = [...prev]
          newAwsImageUrls[index] = awsResponse
          return newAwsImageUrls
        })

        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => {
              const newImages = [...prev]
              newImages[index] = event.target?.result as string
              return newImages
            })
          }
        }

        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Upload failed:", error)
      } finally {
        setIsUploading((prev) => {
          const newIsUploading = [...prev]
          newIsUploading[index] = false
          return newIsUploading
        })
      }
    }
  }

  const handleRemoveImage = async (index: number) => {
    if (awsImageUrls[index].key) {
      try {
        await deleteFromAWS(awsImageUrls[index].key as string)
      } catch (error) {
        console.error(`Failed to delete image ${index}:`, error)
      }
    }

    setImages((prev) => {
      const newImages = [...prev]
      newImages[index] = ""
      return newImages
    })

    setAwsImageUrls((prev) => {
      const newAwsImageUrls = [...prev]
      newAwsImageUrls[index] = {}
      return newAwsImageUrls
    })

    setUploadProgress((prev) => {
      const newProgress = [...prev]
      newProgress[index] = 0
      return newProgress
    })

    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = ""
    }
  }

  const triggerFileInput = (index: number) => {
    fileInputRefs[index].current?.click()
  }

  const handleGenerateText = async () => {
    console.log("AWS Image URLs:", awsImageUrls)
    setIsGenerating(true)

    try {
      const Awsurls = awsImageUrls.filter((item) => item.awsUrl).map((item) => item.awsUrl)

      if (Awsurls.length === 0) {
        alert("Please upload at least one image")
        setIsGenerating(false)
        return
      }

      const data = {
        url: Awsurls,
      }

      const res = await axios.post(`${url}/openai/imageToText`, data)
      console.log(res)
      setExtractedText(res.data.data.replace(/\*\*/g, ""))

      for (let i = 0; i < images.length; i++) {
        if (awsImageUrls[i].key) {
          try {
            await deleteFromAWS(awsImageUrls[i].key as string)
          } catch (error) {
            console.error(`Failed to delete image ${i}:`, error)
          }
        }
      }

      setImages(["", "", ""])
      setAwsImageUrls([{}, {}, {}])
      setUploadProgress([0, 0, 0])

      fileInputRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.value = ""
        }
      })
    } catch (error) {
      console.error("Error generating text:", error)
      setExtractedText("Error extracting text from images. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#1c0e29] to-[#160a27] border border-[#3b1d59]/30 shadow-[0_0_15px_rgba(74,29,106,0.15)] backdrop-blur-sm max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3b1d59]/50 rounded-lg relative max-w-4xl w-full p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Select Images</h2>

      <div className="grid grid-cols-3 gap-10 mb-6 mx-auto justify-center w-fit ">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square h-[150px] w-[150px]  border border-[#3b1d59] rounded-lg overflow-hidden flex items-center justify-center bg-[#2a1541] hover:bg-[#3b1d59] transition-colors cursor-pointer group"
            onClick={() => !isUploading[index] && triggerFileInput(index)}
          >
            <input
              type="file"
              ref={fileInputRefs[index]}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageSelect(index, e)}
              disabled={isUploading[index]}
            />

            {isUploading[index] ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 mb-2 animate-spin text-purple-400" />
                <span className="text-sm text-purple-300">{uploadProgress[index]}%</span>
              </div>
            ) : image ? (
              <>
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Selected image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80 transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage(index)
                  }}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-purple-300 group-hover:text-white transition-colors">
                <Plus className="h-10 w-10 mb-2" />
                <span className="text-sm font-medium">Add Image</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        className="w-full py-6 text-lg font-semibold bg-[#3b1d59] hover:bg-[#4a2472] transition-colors text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        onClick={handleGenerateText}
        disabled={isUploading.some((uploading) => uploading) || isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Text"
        )}
      </Button>
      {extractedText && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Extracted Text</h3>
          <textarea
            className="w-full h-[250px] p-3 bg-[#2a1541] text-white border border-[#3b1d59] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4a2472]"
            value={extractedText}
            readOnly
          />
        </div>
      )}
    </div>
  )
}

