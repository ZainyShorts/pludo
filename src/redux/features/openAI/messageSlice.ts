import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

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
  },
})

export const { sendMessage } = messageSlice.actions
export default messageSlice.reducer

