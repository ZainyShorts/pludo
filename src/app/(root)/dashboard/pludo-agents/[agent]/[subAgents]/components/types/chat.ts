export interface ChatInterfaceProps {
    botName: string
    botAvatar?: string
  }
  
  export interface Message {
    id: string
    sender: 'user' | 'bot'
    content: string
  }
  
  