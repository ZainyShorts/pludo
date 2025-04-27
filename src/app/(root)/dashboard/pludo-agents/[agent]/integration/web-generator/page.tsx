'use client'
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "./seperator/seperator";
import { Loader2, Download, Code, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import PreviewFrame from "./preview-frame";

const TEMPLATE_OPTIONS = [
  { value: "gym", label: "Fitness & Gym" },
  { value: "portfolio", label: "Creative Portfolio" },
  { value: "real-estate", label: "Real Estate" },
  { value: "medical", label: "Healthcare & Medical" },
  { value: "restaurant", label: "Restaurant & Food" },
  { value: "ecommerce", label: "E-Commerce" },
];

export default function TemplateGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  
  const handleGenerate = () => {
    if (!selectedTemplate || !description.trim()) return;
    
    setIsGenerating(true);
    setShowIframe(false);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setShowIframe(true);
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
      <Card className="w-full lg:w-[400px] border-border/30 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-medium">Template Generator</CardTitle>
          </div>
          <CardDescription>
            Select a template and provide a description to generate your custom website
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="template" className="text-sm font-medium text-foreground/90">
              Select Template
            </label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template" className="w-full bg-background/50">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent className="bg-popover/90 backdrop-blur-sm border-border/30">
                {TEMPLATE_OPTIONS.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground/90">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe what you want in your website..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-background/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about the features, style, and content you want.
            </p>
          </div>
        </CardContent>
        
        <Separator className="mb-4 bg-border/20" />
        
        <CardFooter className="flex-col gap-4">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !selectedTemplate || !description.trim()}
            className="w-full gap-2 bg-primary/90 hover:bg-primary transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Template
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "w-full gap-2 transition-all duration-300 bg-background/50 border-border/50",
              !isGenerated && "opacity-0 pointer-events-none h-0 mt-0 mb-0 py-0"
            )}
            disabled={!isGenerated}
          >
            <Download className="h-4 w-4" />
            Download ZIP
          </Button>
        </CardFooter>
      </Card>
      
      <div className={cn(
        "w-full flex-1 transition-all duration-500 ease-in-out",
        !showIframe && "opacity-0"
      )}>
        <div className="rounded-lg overflow-hidden border border-border/30 shadow-2xl bg-background h-[600px] w-full">
          {showIframe && <PreviewFrame />}
        </div>
      </div>
    </div>
  );
}