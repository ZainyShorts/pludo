export interface MessageContent {
  text?: string
  url?: string[]
  audio?: string
}

export interface Message {
  id: string
  sender: string
  content: MessageContent
} 
export interface Image  {  
   file: File;  
   preview: string; 
   awsUrl: string | null  
  } 
  

export interface ChatInterfaceProps {
  botName?: string
  botAvatar?: string
  mainAgent?: string
}

