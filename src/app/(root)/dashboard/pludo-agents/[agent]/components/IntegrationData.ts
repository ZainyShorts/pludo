import {  Twitter, Instagram, Mail , MailOpen  } from "lucide-react" 
import BulkEmail from "./Integrations/Ace/BulkEmail" 
import EmailSummary from "./Integrations/Ace/EmailSummary" 
import EmailScheduler from "./Integrations/Ace/ScheduleEmail" 
import WebsiteAnalyzer from "./Integrations/Ace/WebAnalyzer"

export const integrations = [
    {
      id: "ace-email",
      name: "Bulk Emailing",
      icon: Mail,
      description: "Send Emails in bulk and Connect with professionals and share business updates.", 
      Modal : BulkEmail
    },
    {
      id: "ace-emailSummary",
      name: "Email Summary",
      icon: MailOpen,
      description: "Engage with a broad audience and promote events.", 
      Modal : EmailSummary
    },
    {
      id: "ace-schedule",
      name: "Schedule Email",
      icon: Twitter,
      description: "Share real-time updates and join trending conversations.", 
      Modal: EmailScheduler
    },
    {
      id: "ace-analyzar",
      name: "Web Analyzar",
      icon: Instagram,
      description: "Showcase visual content and reach a younger demographic.", 
      Modal : WebsiteAnalyzer
    }, 

  ]