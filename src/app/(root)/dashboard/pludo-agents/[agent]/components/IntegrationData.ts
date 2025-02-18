import {  CalendarCheck2 , MailPlus , Mail , MailOpen  } from "lucide-react" 
import BulkEmail from "./Integrations/Ace/BulkEmail" 
import EmailSummary from "./Integrations/Ace/EmailSummary" 
import EmailScheduler from "./Integrations/Ace/ScheduleEmail" 
import WebsiteAnalyzer from "./Integrations/Ace/TemplateGenerator"

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
      description: "Best for Getting Your Today Email's Summary Just with one click", 
      Modal : EmailSummary
    },
    {
      id: "ace-schedule",
      name: "Schedule Email",
      icon: CalendarCheck2,
      description: "By using ths Feature you can scheduling the Emails for the Future", 
      Modal: EmailScheduler
    },
    {
      id: "ace-analyzar",
      name: "Template Generator",
      icon: MailPlus,
      description: "By using this feature you can write and send upto 30 Emails just with one click.", 
      Modal : WebsiteAnalyzer
    }, 

  ]