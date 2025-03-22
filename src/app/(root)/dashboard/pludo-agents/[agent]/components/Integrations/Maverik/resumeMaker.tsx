"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Wand2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

const url = process.env.NEXT_PUBLIC_PLUDO_SERVER || ""
const MAX_FILE_SIZE_MB = 5 // Maximum file size in MB

const uploadImageToAWS = async (file: File, setUploadProgress: (progress: number) => void): Promise<any> => {
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

// AWS delete helper function
const deleteFromAWS = async (filename: string): Promise<void> => {
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

export default function CVMaker() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    summary: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageKey, setImageKey] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.type.includes("image/")) {
        setErrors({
          ...errors,
          file: "Please upload an image file",
        })
        return
      }

      const fileSizeMB = selectedFile.size / (1024 * 1024)
      console.log("File size:", fileSizeMB.toFixed(2), "MB")

      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setErrors({
          ...errors,
          file: `File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller image.`,
        })
        return
      }

      setFile(selectedFile)

      if (imageKey) {
        await handleRemoveImage()
      }

      await handleUploadImage(selectedFile)
    }
  }

  const handleUploadImage = async (imageFile: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const { awsUrl, key } = await uploadImageToAWS(imageFile, setUploadProgress)

      const fullImageUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}${key}`
      console.log(fullImageUrl)

      setImageUrl(fullImageUrl)
      setImageKey(key)
    } catch (error) {
      console.error("Error uploading image:", error)
      setErrors({
        ...errors,
        file: "Failed to upload image. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!imageKey) return

    try {
      await deleteFromAWS(imageKey)
      setImageUrl("")
      setImageKey("")
      setFile(null)
      setUploadProgress(0)
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required"
    }

    if (!imageUrl) {
      newErrors.file = "Profile picture is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const consolidatedSummary = `${formData.name}|${formData.email}|${formData.phone}|${formData.summary}`

      const res = await axios.post(
        `${url}/docx/resumeBuilder`,
        {
          summary: consolidatedSummary,
          file: imageUrl,
        },
        {
          responseType: "blob",
        },
      )

      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "resume.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(Url)
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({
        ...errors,
        submit: "Failed to submit CV. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (imageKey) {
        navigator.sendBeacon(`${url}/aws/${imageKey}`, "")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (imageKey) {
        deleteFromAWS(imageKey).catch((err) => console.error("Error cleaning up image:", err))
      }
    }
  }, [imageKey])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Wand2 className="text-purple-400" />
            CV Maker
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-purple-800/50 mb-3 flex items-center justify-center border-2 border-purple-400/50">
                {imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt="Profile"
                      fill
                      unoptimized={true}
                      className="object-cover"
                      onError={(e) => {
                        const imgElement = e.currentTarget
                        const parent = imgElement.parentElement
                        if (parent) {
                          const fallbackImg = document.createElement("img")
                          fallbackImg.src = imageUrl
                          fallbackImg.alt = "Profile"
                          fallbackImg.className = "absolute inset-0 w-full h-full object-cover"
                          parent.innerHTML = ""
                          parent.appendChild(fallbackImg)
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Upload className="w-12 h-12 text-purple-300/70" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="w-full max-w-[200px] mb-3">
                  <Progress value={uploadProgress} className="h-2 bg-purple-900/50" />
                  <p className="text-xs text-center mt-1 text-purple-200">{uploadProgress}%</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={`border-purple-500 text-black hover:text-white hover:bg-purple-800/50 ${errors.file ? "border-red-500" : ""}`}
                    disabled={isUploading}
                  >
                    {file ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                  </Button>
                </div>

                {imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-500 text-red-200 hover:bg-red-800/50"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              {errors.file && (
                <Alert variant="destructive" className="mt-3 bg-red-500/20 border-red-500 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.file}</AlertDescription>
                </Alert>
              )}

              <div className="mt-2 text-xs text-purple-300">Maximum file size: {MAX_FILE_SIZE_MB}MB</div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-200">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-300/50 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-purple-200">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-300/50 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-purple-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-300/50 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="summary" className="text-purple-200">
                  Professional Summary
                </Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="A brief overview of your experience and skills..."
                  value={formData.summary}
                  onChange={handleChange}
                  className={`bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-300/50 min-h-[100px] ${
                    errors.summary ? "border-red-500" : ""
                  }`}
                />
                {errors.summary && <p className="text-red-400 text-sm mt-1">{errors.summary}</p>}
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-sm">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Generate CV"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

