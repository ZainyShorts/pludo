import {
  CalendarCheck2,
  MailPlus,
  Mail,
  MailOpen,
  FileText,
  Globe,
  ScanText,
  ContrastIcon as Compare,
} from "lucide-react"

import BulkEmail from "./Integrations/Ace/BulkEmail"
import EmailSummary from "./Integrations/Ace/EmailSummary"
import EmailScheduler from "./Integrations/Ace/ScheduleEmail"
import TemplateGenerator from "./Integrations/Ace/TemplateGenerator"
import PDFSummary from "./Integrations/Delta/PdfSummary"
import WebScrap from "./Integrations/Delta/WebScrap"
import TextExtract from "./Integrations/Delta/TextExtract"
import FileComparison from "./Integrations/Delta/FileComparison"

export const integrations = [
  {
    id: "ace",
    name: "Ace",
    icon: Mail,
    description: "Email automation and management tools",
    subagents: [
      {
        id: "ace-email",
        name: "Bulk Emailing",
        icon: Mail,
        description: "Send Emails in bulk and connect with professionals and share business updates.",
        Modal: BulkEmail,
      },
      {
        id: "ace-emailSummary",
        name: "Email Summary",
        icon: MailOpen,
        description: "Best for getting your today's email summary just with one click.",
        Modal: EmailSummary,
      },
      {
        id: "ace-schedule",
        name: "Schedule Email",
        icon: CalendarCheck2,
        description: "By using this feature, you can schedule emails for the future.",
        Modal: EmailScheduler,
      },
      {
        id: "ace-analyzar",
        name: "Template Generator",
        icon: MailPlus,
        description: "By using this feature, you can write and send up to 30 emails just with one click.",
        Modal: TemplateGenerator,
      },
    ],
  },
  {
    id: "delta",
    name: "Delta",
    icon: FileText,
    description: "Document and web content processing tools",
    subagents: [
      {
        id: "delta-pdfsummary",
        name: "PDF Summary",
        icon: FileText,
        description: "Extract and summarize content from PDF documents quickly and efficiently.",
        Modal: PDFSummary,
      },
      {
        id: "delta-webscrap",
        name: "Web Scraping",
        icon: Globe,
        description: "Extract useful information from web pages with ease.",
        Modal: WebScrap,
      },
      {
        id: "delta-textextract",
        name: "Text Extraction",
        icon: ScanText,
        description: "Extract text from images and scanned documents using OCR.",
        Modal: TextExtract,
      },
      {
        id: "delta-filecomparison",
        name: "File Comparison",
        icon: Compare,
        description: "Compare two files and identify differences quickly.",
        Modal: FileComparison,
      },
    ],
  },
]

