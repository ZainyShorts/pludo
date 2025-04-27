import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { downloadFile, generateZipDownload } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewProps {
  html: string;
  css: string;
  js: string;
  businessName: string;
}

const CodeView: React.FC<CodeViewProps> = ({ 
  html, 
  css, 
  js,
  businessName 
}) => {
  const [activeTab, setActiveTab] = useState('html');

  const handleDownload = () => {
    const formattedName = businessName.toLowerCase().replace(/\s+/g, '-');
    generateZipDownload(html, css, js, formattedName);
  };

  const handleDownloadIndividual = (content: string, filename: string) => {
    const formattedName = businessName.toLowerCase().replace(/\s+/g, '-');
    downloadFile(content, `${formattedName}-${filename}`, 'text/plain');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-medium text-white flex items-center">
          <i className="fas fa-code text-white mr-2"></i>
          Generated Code
        </h3>
        <Button 
          onClick={handleDownload}
          className="text-sm bg-primary hover:bg-primary/90"
          disabled={!html || !css || !js}
        >
          <i className="fas fa-download mr-2"></i> Download All Files
        </Button>
      </div>
      
      <Tabs
        defaultValue="html"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b border-gray-800">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger 
              value="html" 
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none`}
            >
              HTML
            </TabsTrigger>
            <TabsTrigger 
              value="css" 
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none`}
            >
              CSS
            </TabsTrigger>
            <TabsTrigger 
              value="js" 
              className={`px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none`}
            >
              JavaScript
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 relative">
          <TabsContent 
            value="html" 
            className="m-0 p-0 h-full data-[state=active]:flex flex-col absolute inset-0"
          >
            <div className="flex justify-end p-2 bg-gray-900">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDownloadIndividual(html, 'index.html')}
                disabled={!html}
              >
                <i className="fas fa-download mr-1"></i> Download HTML
              </Button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {html ? (
                <SyntaxHighlighter
                  language="html"
                  style={atomDark}
                  showLineNumbers
                  customStyle={{ margin: 0, height: '100%' }}
                >
                  {html}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Generated HTML code will appear here
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent 
            value="css" 
            className="m-0 p-0 h-full data-[state=active]:flex flex-col absolute inset-0"
          >
            <div className="flex justify-end p-2 bg-gray-900">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDownloadIndividual(css, 'styles.css')}
                disabled={!css}
              >
                <i className="fas fa-download mr-1"></i> Download CSS
              </Button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {css ? (
                <SyntaxHighlighter
                  language="css"
                  style={atomDark}
                  showLineNumbers
                  customStyle={{ margin: 0, height: '100%' }}
                >
                  {css}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Generated CSS code will appear here
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent 
            value="js" 
            className="m-0 p-0 h-full data-[state=active]:flex flex-col absolute inset-0"
          >
            <div className="flex justify-end p-2 bg-gray-900">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDownloadIndividual(js, 'script.js')}
                disabled={!js}
              >
                <i className="fas fa-download mr-1"></i> Download JavaScript
              </Button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {js ? (
                <SyntaxHighlighter
                  language="javascript"
                  style={atomDark}
                  showLineNumbers
                  customStyle={{ margin: 0, height: '100%' }}
                >
                  {js}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Generated JavaScript code will appear here
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CodeView;
