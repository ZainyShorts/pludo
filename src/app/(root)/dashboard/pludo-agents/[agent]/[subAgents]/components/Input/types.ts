export interface MessageContent {
    text?: string
    image?: string
    audio?: string
  }
  
  export interface Message {
    id: string
    sender: string
    content: MessageContent
  }
  
  export interface ChatInterfaceProps {
    botName?: string
    botAvatar?: string
    mainAgent?: string
  }
  
  