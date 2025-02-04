import type { RefObject } from "react"
import type React from "react"    
import axios from 'axios';
import { MessageContent } from "./types";
 const url = process.env.NEXT_PUBLIC_PLUDO_SERVER;
export const resetTextareaHeight = (textareaRef: RefObject<HTMLTextAreaElement>) => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "40px"
  }
}

export const adjustTextareaHeight = (textareaRef: RefObject<HTMLTextAreaElement>) => {
  if (textareaRef.current) {
    resetTextareaHeight(textareaRef)
    const scrollHeight = textareaRef.current.scrollHeight
    textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`
  }
}

export const handleCancelImage = async (
  selectedImage: { file: File; preview: string; awsUrl: string | null } | null,
  setSelectedImage: (image: { file: File; preview: string; awsUrl: string | null } | null) => void,
) => {
  if (selectedImage) { 
    await deleteFromAWS(selectedImage.file.name);
    URL.revokeObjectURL(selectedImage.preview)
    setSelectedImage(null)
  }
}

export const handleSendMessage = (
  input: string,
  selectedImage: { file: File; preview: string; awsUrl: string | null } | null,
  audio: Blob | null,
  onSendMessage: (content: MessageContent) => void,
  setInput: (input: string) => void,
  setSelectedImage: (image: { file: File; preview: string; awsUrl: string | null } | null) => void,
  setAudio: (audio: Blob | null) => void,  
  resetTextareaHeightCallback: () => void, 
  
) => {
  const content: MessageContent = {}

  if (input.trim()) {
    content.text = input.trim()
  }

  if (selectedImage) {
    content.image = selectedImage.awsUrl || selectedImage.preview
  }

  if (audio) {
    const audioUrl = URL.createObjectURL(audio)
    content.audio = audioUrl
  }

  if (Object.keys(content).length === 0) {
    console.log("Attempted to send an empty message")
    return
  }

  try {
    onSendMessage(content)
  } catch (error) {
    console.error("Failed to send message:", error)
  }

  setInput("")
  setSelectedImage(null)
  setAudio(null)
  resetTextareaHeightCallback()
}




export const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setSelectedImage: (image: { file: File; preview: string; awsUrl: string | null } | null) => void,
  setUploadProgress: (progress: number) => void,
) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
      awsUrl: null,
    });

    try {
      const { awsUrl , key } = await uploadImageToAWS(file, setUploadProgress);
      console.log(`${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}`+key);
      setSelectedImage((prevState ) => {
        if (prevState) {
          return { ...prevState, preview: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}`+key, awsUrl: awsUrl };
        }
        return null;
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      setSelectedImage(null);
    }
  }
}; 
export const triggerImageUpload = (fileInputRef: RefObject<HTMLInputElement>) => {
  fileInputRef.current?.click()
}



export const uploadImageToAWS = async (
  file: File,
  setUploadProgress: (progress: number) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.get(`${url}/aws/signed-url?fileName=${file.name}&contentType=${file.type}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const signedUrl = response.data.msg.url;

    const uploadResponse = await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      },
    });

    if (uploadResponse.status === 200) {
      return {awsUrl:signedUrl.split('?')[0], key:response.data.msg.key}; 
    } else {
      throw new Error('Failed to upload file');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}; 
export const deleteFromAWS = async (filename: string): Promise<void> => {
    try {
      const response = await axios.delete(`${url}/aws/${filename}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response) { 
        return response.data;
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  };
