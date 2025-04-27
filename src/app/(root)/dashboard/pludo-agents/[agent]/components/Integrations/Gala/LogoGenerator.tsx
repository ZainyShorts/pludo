import React, { useState } from 'react';
import { Download } from 'lucide-react';
import axios from 'axios';

const LogoGenerator: React.FC = () => {
  const [logoText, setLogoText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!logoText.trim()) {
      setError('Please enter a logo description');
      return;
    }

    setIsGenerating(true);
    setShowLogo(false);
    setError(null);

    try {
      // Add "logo" to the prompt and specify it should be a logo
      const prompt = `${logoText} - generate a professional logo, vector style, minimal design`;
      
      const response = await axios.post(
        'https://l8wlljm3-3011.inc1.devtunnels.ms/openai/generateImage',
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        }
      );

      if (!response.data?.imageUrl) {
        throw new Error('No image URL in response');
      }

      setLogoUrl(response.data.imageUrl);
      setShowLogo(true);
    } catch (err) {
      console.error('Logo generation error:', err);
      setError('Failed to generate logo. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!logoUrl) return;
    
    const link = document.createElement('a');
    link.href = logoUrl;
    const filename = `logo-${logoText.substring(0, 20).toLowerCase().replace(/\s+/g, '-') || 'logo'}.png`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[400px] bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 rounded-xl shadow-2xl overflow-hidden border border-fuchsia-500/30">
      <div className="p-6 h-full w-full flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 mb-6">
          AI Logo Generator
        </h2>
        
        <div className={`space-y-4 ${!showLogo ? 'flex-1 flex flex-col justify-center' : 'mb-6'}`}>
          <div className="relative">
            <input
              type="text"
              value={logoText}
              onChange={(e) => {
                setLogoText(e.target.value);
                setError(null);
              }}
              placeholder="Describe your logo (e.g., 'tech company logo')"
              className="w-full p-3 bg-black/50 border border-fuchsia-500/50 rounded-lg text-white placeholder-fuchsia-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-800 hover:from-fuchsia-700 hover:to-purple-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-fuchsia-900/50 disabled:opacity-70"
          >
            {isGenerating ? 'Generating...' : 'Generate Logo'}
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
                <p className="font-medium">Designing Your Logo</p>
                <p className="text-xs opacity-70 mt-1">Creating professional vector logo...</p>
              </div>
            </div>
          </div>
        )}
        
        {showLogo && logoUrl && (
          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-fuchsia-500/20">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-fuchsia-300">Your AI-Generated Logo</h3>
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
                  src={logoUrl} 
                  alt={`AI generated logo: ${logoText}`}
                  className="max-h-[200px] max-w-full object-contain rounded shadow-xl animate-fade-in"
                  onError={() => setError('Failed to load logo')}
                /> 
              </div>
              <p className="mt-4 text-xs text-fuchsia-300/70 text-center">
                {logoText || "AI Generated Logo"} • Professional Logo Generator
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoGenerator;