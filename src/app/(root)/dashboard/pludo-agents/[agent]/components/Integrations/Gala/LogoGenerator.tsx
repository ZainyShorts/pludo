import React, { useState } from 'react';
import { Loader2, Download } from 'lucide-react';

const LogoGenerator: React.FC = () => {
  const [logoText, setLogoText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowLogo(true);
    }, 1500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://static.vecteezy.com/system/resources/previews/005/076/592/non_2x/hacker-mascot-for-sports-and-esports-logo-free-vector.jpg';
    link.download = `${logoText || 'cyberpunk'}-logo.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[400px] bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 rounded-xl shadow-2xl overflow-hidden border border-fuchsia-500/30">
      <div className="p-6 h-full w-full flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 mb-6">
           Logo Generator
        </h2>
        
        <div className={`space-y-4 ${!showLogo ? 'flex-1 flex flex-col justify-center' : 'mb-6'}`}>
          <div className="relative">
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="Enter your brand name"
              className="w-full p-3 bg-black/50 border border-fuchsia-500/50 rounded-lg text-white placeholder-fuchsia-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-800 hover:from-fuchsia-700 hover:to-purple-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-fuchsia-900/50 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Logo</span>
            )}
          </button>
        </div>
        
        {showLogo && (
          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-fuchsia-500/20">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-fuchsia-300">Your Generated Logo</h3>
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
                  src="https://static.vecteezy.com/system/resources/previews/005/076/592/non_2x/hacker-mascot-for-sports-and-esports-logo-free-vector.jpg" 
                  alt="Generated Logo" 
                  className="max-h-[200px] object-contain rounded shadow-xl"
                />
              </div>
              <p className="mt-4 text-xs text-fuchsia-300/70 text-center">
                {logoText || "Hacker Mascot"} • Generated with Gala Logo Generator
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoGenerator;