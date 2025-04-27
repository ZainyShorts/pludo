import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PreviewFrame() {
  const [isLoading, setIsLoading] = useState(true);
  
  // For safety, we'll use a timeout to show the iframe after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative w-full h-full bg-background/20">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <iframe
        src="https://www.freepik.com/"
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
        title="Preview"
      />
    </div>
  );
}