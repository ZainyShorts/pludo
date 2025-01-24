import useFetchHook from "@/hooks/apiCall"

const API_URL = "https://alihamza.store/api"

export const useAIFunctions = () => {
  const { fetchData } = useFetchHook()
    
  const createThread = async () => {
    const res =  await fetchData('https://alihamza.store/api/create/thread','GET'); 
    return res.thread.id;
    } 
  const createMessage = async (data: any) => {
    try {
      const res = await fetchData(`${API_URL}/create/message`, "POST", data)
      return res
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  const getRun = async (id: string , ass_id : string) => {
    const runData = {
      threadId: id,
      assistantId: ass_id,
    }
    try {
      const run = await fetchData(`${API_URL}/create/run`, "POST", runData)
      if (run.response === true) {
        return run.run.id
      }
      throw new Error("Run creation failed")
    } catch (error) {
      console.error("Error getting run:", error)
      throw error
    }
  }

  const getResponse = async (threadID: string, runid: string) => {
    const data = {
      threadId: threadID,
      runId: runid,
    }
    try {
      const res = await fetchData(`${API_URL}/get/runStatus`, "POST", data)
      if (res.response === true) {
        return res.run.status
      }
      return res
    } catch (error) {
      console.error("Error getting response:", error)
      throw error
    }
  }

  const getReply = async (threadId: string) => {
    try {
      const message = await fetchData(`${API_URL}/get/messages?threadId=${threadId}`, "GET")
      const body = message.list.body
      const reply = body.data[0].content[0].text.value
      return reply
    } catch (error) {
      console.error("Error getting reply:", error)
      throw error
    }
  }

  return { 
    createThread,
    createMessage,
    getRun,
    getResponse,
    getReply,
  }
}

