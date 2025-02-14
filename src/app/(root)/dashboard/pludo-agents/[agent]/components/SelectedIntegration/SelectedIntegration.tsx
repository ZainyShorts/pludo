import BulkEmail from "../Integrations/Ace/BulkEmail" 
import EmailSummary from "../Integrations/Ace/EmailSummary" 
import EmailScheduler from "../Integrations/Ace/ScheduleEmail" 
import WebsiteAnalyzer from "../Integrations/Ace/WebAnalyzer"

interface SelectedIntegrationProps {
  selectedId: string | null
}

export function SelectedIntegration({ selectedId }: SelectedIntegrationProps) {
  switch (selectedId) {
    case "bulkEmail":
      return <BulkEmail />  
    case "EmailSummary" : 
     return  <EmailSummary />  
     case "Schedule": 
      return <EmailScheduler/>  
      case "analyzar": 
      return <WebsiteAnalyzer /> 
    // Add more cases here as you add more integrations
    default:
      return <div>No integration selected</div>
  }
}

