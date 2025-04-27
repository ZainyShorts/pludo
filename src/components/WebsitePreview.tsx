import React, { useState, useRef, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface WebsitePreviewProps {
  html: string;
  css: string;
  js: string;
  isLoading: boolean;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  html, 
  css, 
  js, 
  isLoading 
}) => {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px"
  };

  useEffect(() => {
    if (html && css && js && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${js}</script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [html, css, js]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 text-white p-1 rounded">
            <i className="fas fa-eye"></i>
          </div>
          <h3 className="font-medium text-white">Live Preview</h3>
        </div>
        <div className="flex space-x-4">
          <button 
            className={`${viewMode === 'desktop' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewMode('desktop')}
            aria-label="Desktop view"
          >
            <i className="fas fa-desktop"></i>
          </button>
          <button 
            className={`${viewMode === 'tablet' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewMode('tablet')}
            aria-label="Tablet view"
          >
            <i className="fas fa-tablet-alt"></i>
          </button>
          <button 
            className={`${viewMode === 'mobile' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewMode('mobile')}
            aria-label="Mobile view"
          >
            <i className="fas fa-mobile-alt"></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden">
        <div className="bg-[#111111] rounded-lg overflow-hidden h-full shadow-lg border border-gray-800 relative">
          <div 
            className="w-full h-full overflow-auto custom-scrollbar"
            style={{ 
              maxWidth: viewportWidths[viewMode],
              margin: viewMode !== "desktop" ? "0 auto" : "",
              transition: "max-width 0.3s ease"
            }}
          >
            {html && css && js ? (
              <iframe
                ref={iframeRef}
                title="Website Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : !isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Enter your business details and click "Generate Website" to see a preview.
              </div>
            ) : null}
          </div>
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-20">
              <div className="text-center">
                <LoadingSpinner size="lg" text="Generating your website..." />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
