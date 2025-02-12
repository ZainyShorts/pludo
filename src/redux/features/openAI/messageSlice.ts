import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { json } from "stream/consumers"

export interface MessageContent {
  text?: string
  image?: string[]
  audio?: string
}

export interface Message {
  id: string
  sender: string
  content: MessageContent
}

export interface MessageState {
  messages: Message[]
}

const initialState: MessageState = {
  messages: [],
}

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    updateBotMessage : (state, action: PayloadAction<{ id: string; chunk: string }>) => { 
      const {id, chunk} = action.payload;  
      const botMessage = state.messages.find(msg => msg.id === id && msg.sender === 'bot');
      if (botMessage) { 
        botMessage.content.text += chunk;
      }
    },
    setEmpty: (state) => {
      state.messages = []
    }, 
  },
})

export const { sendMessage, setEmpty , updateBotMessage} = messageSlice.actions
export default messageSlice.reducer

