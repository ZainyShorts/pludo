import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge" 
import { z } from 'zod';



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format code to make it prettier
export function formatHtmlCode(code: string): string {
  try {
    return code.replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '>\n<')
      .replace(/(\w+)="([^"]*)"/g, '$1="$2"')
      .replace(/<([^\s>]+)([^>]*)>/g, '<$1$2>')
      .replace(/<\/(\w+)>/g, '</$1>');
  } catch (error) {
    console.error('Error formatting HTML code:', error);
    return code;
  }
} 

export const templateOptions = [
  { value: 'corporate', label: 'Corporate Professional' },
  { value: 'creative', label: 'Creative Studio' },
  { value: 'minimal', label: 'Minimalist Business' },
  { value: 'bold', label: 'Bold & Dynamic' },
  { value: 'elegant', label: 'Elegant & Refined' },
];

// Generate a downloadable zip file
export function generateZipDownload(html: string, css: string, js: string, filename: string) {
  // Use client-side JSZip library
  const JSZip = (window as any).JSZip;
  
  if (!JSZip) {
    throw new Error("JSZip library not loaded");
  }
  
  const zip = new JSZip();
  
  // Add files to the zip
  zip.file("index.html", html);
  zip.file("styles.css", css);
  zip.file("script.js", js);
  
  // Generate the zip file
  zip.generateAsync({ type: "blob" }).then(function(content: Blob) {
    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = `${filename}.zip`;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
}

// Download a single file
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const availableComponents = [
  { value: "hero", label: "Hero Section" },
  { value: "services", label: "Services Section" },
  { value: "features", label: "Features Section" },
  { value: "team", label: "Team Section" },
  { value: "testimonials", label: "Testimonials Section" },
  { value: "blog", label: "Blog Preview Section" },
  { value: "pricing", label: "Pricing Section" },
  { value: "cta", label: "CTA Section" },
  { value: "footer", label: "Footer" }
];

export const industryOptions = [
  // { value: "technology", label: "Technology" },
  // { value: "healthcare", label: "Healthcare" },
  // { value: "education", label: "Education" },
  // { value: "finance", label: "Finance" },
  // { value: "retail", label: "Retail" },
  // { value: "restaurant", label: "Restaurant" },
  { value: "gym", label: "Gym" },
  // { value: "creative", label: "Creative & Design" },
  // { value: "professional", label: "Professional Services" },
  // { value: "real_estate", label: "Real Estate" },
  // { value: "hospitality", label: "Hospitality" },
  // { value: "travel", label: "Travel & Tourism" },
  // { value: "nonprofit", label: "Non-profit" },
  { value: "other", label: "Other" }
];

export const styleOptions = [
  { value: "Modern Black", label: "Modern Black" },
  { value: "Minimalist", label: "Minimalist" },
  { value: "Bold & Vibrant", label: "Bold & Vibrant" },
  { value: "Corporate", label: "Corporate" }
];
export const formSchema = z.object({
  businessDetail: z.string().min(10, {
    message: "Business details must be at least 10 characters",
  }),
  businessName: z.string().min(1, {
    message: "Business name is required",
  }),
 
  color: z.string().min(1, {
    message: "Please select a color",
  }),
  template: z.string().min(1, {
    message: "Please select a template",
  }),
});
