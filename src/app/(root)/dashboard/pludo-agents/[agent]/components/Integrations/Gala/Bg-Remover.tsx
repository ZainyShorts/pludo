import React, { useState, useRef } from 'react';
import { Download, Upload, Image, Trash2, Sparkles } from 'lucide-react';
import axios from 'axios';

const BackgroundRemover: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setError(null);
    setProcessedImage(null);

    // Validate file
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Set the file and create preview
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!imageFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile); 

      const response = await axios.post('https://l8wlljm3-3011.inc1.devtunnels.ms/openai/bgRemove',formData , { 
            responseType: 'blob' 
      });
       
     console.log(response);
      
     const imageData = response.data;

    
    const imageUrl = URL.createObjectURL(imageData); 
    console.log(imageUrl)
    setProcessedImage(imageUrl);

    } catch (err) {
      console.error('Background removal error:', err);
      setError('Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(processedImage);
  };

  const resetAll = () => {
    setImageFile(null);
    setImagePreview(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clean up any existing object URLs
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[500px] bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 rounded-xl shadow-2xl overflow-hidden border border-fuchsia-500/30">
      <div className="p-6 h-full w-full flex flex-col">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 mb-6">
          Professional Background Remover
        </h2>

        {!imageFile && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-fuchsia-500/30 rounded-xl bg-black/20 p-8 transition-all hover:bg-black/30 hover:border-fuchsia-500/50 group">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-fuchsia-900/20 rounded-full border border-fuchsia-500/30 group-hover:border-fuchsia-500/50">
                <Upload className="w-8 h-8 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-fuchsia-200">Upload an Image</h3>
                <p className="text-sm text-fuchsia-300/60 mt-1">PNG or JPG (max 5MB)</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/30 rounded-lg text-fuchsia-300 text-sm transition-colors"
              >
                Select File
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {imageFile && (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/30 rounded-lg p-4 border border-fuchsia-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-fuchsia-300 flex items-center gap-2">
                    <Image className="w-4 h-4" /> Original
                  </h3>
                  <button
                    onClick={resetAll}
                    className="text-xs flex items-center gap-1 text-fuchsia-400/70 hover:text-fuchsia-300 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="flex items-center justify-center h-64 bg-black/10 rounded overflow-hidden">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Original" 
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-fuchsia-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-fuchsia-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Processed
                  </h3>
                  {processedImage && (
                    <button
                      onClick={handleDownload}
                      className="text-xs flex items-center gap-1 px-2 py-1 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 rounded text-fuchsia-300 transition-colors"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center h-64 bg-black/10 rounded overflow-hidden">
                  {processedImage ? (
                    <img 
                      src={processedImage} 
                      alt="Background Removed" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : isProcessing ? (
                    <div className="flex flex-col items-center justify-center space-y-3 text-fuchsia-300">
                      <div className="w-10 h-10 border-4 border-fuchsia-500/20 rounded-full animate-spin border-t-fuchsia-500"></div>
                      <p className="text-sm">Removing background...</p>
                    </div>
                  ) : (
                    <div className="text-center text-fuchsia-300/50 text-sm p-6">
                      <p>Processed image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-black/40 hover:bg-black/60 border border-fuchsia-500/30 rounded-lg text-fuchsia-300 text-sm transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Change Image
              </button>
              
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing || !imageFile}
                className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-800 hover:from-fuchsia-700 hover:to-purple-900 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-fuchsia-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Remove Background
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-xs text-fuchsia-300/50 text-center">
          <p>Powered by AI Background Removal • High-quality processing • Instant results</p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;