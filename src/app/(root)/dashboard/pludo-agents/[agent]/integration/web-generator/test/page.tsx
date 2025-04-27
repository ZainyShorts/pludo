'use client'
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BusinessForm from "@/components/BusinessForm";
import WebsitePreview from "@/components/WebsitePreview";
import CodeView from "@/components/CodeView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  imageUrls: string[];
}

const WebsiteGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"preview" | "code">("preview");
  const [businessName, setBusinessName] = useState("");
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite>({
    html: "",
    css: "",
    js: "",
    imageUrls: []
  });
  const { toast } = useToast();

  const handleGenerateWebsite = async (formData: any) => {
    try {
      setIsGenerating(true);
      setBusinessName(formData.businessName); 
      console.log('formData',formData)
      
      const {data} = await axios.post("https://l8wlljm3-3011.inc1.devtunnels.ms/openai/generateWebsiteCode", formData);
      console.log('data',data); 
      if (data.html) {
        setGeneratedWebsite({
          html: data.html,
          css: data.css,
          js: data.js,
          imageUrls: data.imageUrls || []
        });
         
    }
    //     toast({
    //       title: "Website generated successfully!",
    //       description: "Your website code is ready to preview and download.",
    //       variant: "default",
    //     });
    //   } else {
    //     throw new Error("Failed to generate website code");
    //   }
    } catch (error) {
      console.error("Error generating website:", error);
      toast({
        title: "Error generating website",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-xl border border-gray-800">
      <div className="grid md:grid-cols-5 min-h-[700px]">
        {/* Input Panel */}
        <div className="md:col-span-2 border-r border-gray-800 p-6 space-y-6">
          <BusinessForm 
            onSubmit={handleGenerateWebsite} 
            isLoading={isGenerating} 
          />
        </div>
        
        {/* Preview/Code Panel */}
        <div className="md:col-span-3 flex flex-col">
          <Tabs 
            defaultValue="preview" 
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as "preview" | "code")}
            className="flex-1 flex flex-col"
          >
            <div className="border-b border-gray-800">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger 
                  value="code" 
                  className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                >
                  Code
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent 
              value="preview" 
              className="m-0 p-0 flex-1 data-[state=active]:block"
            >
              <WebsitePreview 
                html={generatedWebsite.html} 
                isLoading={isGenerating} 
              />
            </TabsContent>
            
            <TabsContent 
              value="code" 
              className="m-0 p-0 flex-1 data-[state=active]:block"
            >
              <CodeView 
                html={generatedWebsite.html} 
                css={generatedWebsite.css} 
                js={generatedWebsite.js}
                businessName={businessName || "website"} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
