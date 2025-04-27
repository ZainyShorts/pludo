import React, { useState } from 'react';
import { Download } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.split('?')[0] || 'png';
  };
  const downloadImage = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Get the content type and determine extension
      const contentType = response.headers.get('content-type');
      const extension = contentType?.split('/')[1] || 'png';
      
      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename || `image-${Date.now()}`}.${extension}`;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback method for cases where fetch fails
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename || `image-${Date.now()}`}.${getFileExtension(url)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleGenerate = async () => {
    if (!promptText.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setShowImage(false);
    setError(null);

    try {
      const response = await fetch('https://l8wlljm3-3011.inc1.devtunnels.ms/openai/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setShowImage(true);
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const filename = `generated-image-${promptText.substring(0, 20).toLowerCase().replace(/\s+/g, '-') || 'image'}.png`;
    
    downloadImage(imageUrl , filename)

  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[400px] bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 rounded-xl shadow-2xl overflow-hidden border border-fuchsia-500/30">
      <div className="p-6 h-full w-full flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 mb-6">
          AI Image Generator
        </h2>
        
        <div className={`space-y-4 ${!showImage ? 'flex-1 flex flex-col justify-center' : 'mb-6'}`}>
          <div className="relative">
            <input
              type="text"
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                setError(null);
              }}
              placeholder="Describe the image you want to generate..."
              className="w-full p-3 bg-black/50 border border-fuchsia-500/50 rounded-lg text-white placeholder-fuchsia-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-800 hover:from-fuchsia-700 hover:to-purple-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-fuchsia-900/50 disabled:opacity-70"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        
        {isGenerating && (
          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-fuchsia-500/20 flex flex-col items-center justify-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-fuchsia-500/20 rounded-full">
                  <div className="w-20 h-20 border-4 border-transparent border-t-fuchsia-500 border-r-fuchsia-500 rounded-full animate-spin absolute inset-0"></div>
                </div>
              </div>
              <div className="text-fuchsia-300 text-center">
                <p className="font-medium">Generating Your Image</p>
                <p className="text-xs opacity-70 mt-1">Creating your artwork with AI...</p>
              </div>
            </div>
          </div>
        )}
        
        {showImage && imageUrl && (
          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-fuchsia-500/20">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-fuchsia-300">Your AI Generated Image</h3>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 rounded-lg text-fuchsia-300 text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt={`AI generated image: ${promptText}`}
                  className="max-h-[200px] max-w-full object-contain rounded shadow-xl animate-fade-in"
                  onError={() => setError('Failed to load image')}
                /> 
              </div>
              <p className="mt-4 text-xs text-fuchsia-300/70 text-center">
                {promptText || "AI Generated Image"} • AI Image Generator
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;