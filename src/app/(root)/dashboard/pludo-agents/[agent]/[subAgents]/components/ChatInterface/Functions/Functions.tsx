import useFetchHook from "@/hooks/apiCall"
import axios from "axios"
const API_URL = process.env.NEXT_PUBLIC_PLUDO_SERVER 

export const useAIFunctions = () => {
  const { fetchData } = useFetchHook()
    
  const createThread = async () => {
    const res =  await fetchData(`${API_URL}/openai/createThread`,'GET');  
    return res?.data?.id;
    }  
  const AudioToText = async (audio : File ) => {  
        const form = new FormData();  
        form.append('file', audio);  
        try { 
        const res = await axios.post(`${API_URL}/openai/speechToText`,form);  
        console.log('res', res);
        return res;
        }
        catch (e) { 
          console.log(e)
        }
    }
  const createMessage = async (data: any) => {  
    try {
      const res = await axios.post(`${API_URL}/openai/stream`, data)  
      
      return res 
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  const createMessageStream = async (data: any, onChunk: (chunk: string) => void) => {  
    try {
      const response = await fetch(`${API_URL}/openai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.body) {
        throw new Error("No response body");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk); // Pass chunks to callback function
      }
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  };

  
  const createMessageWithImage = async (data: any ) => {    
   console.log(data);
    try { 
      const res = await axios.post(`${API_URL}/openai/streamImgToText`, data)  
      console.log('response',res);
      return res 
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  const getRun = async (main:string , sub:string ,id: string ) => { 
    try {
      const run = await fetchData(`${API_URL}/openai/createRun `, "POST", {agent:main , type:sub, threadId:id} ) 
        return run?.data?.id
      
    } catch (error) {
      console.error("Error getting run:", error)
      throw error
    }
  } 


  const getResponse = async (threadID: string, runid: string) => {
   
    try {
      const res = await fetchData(`${API_URL}openai/runStatus?runId=${runid}&threadId=${threadID}`, "GET")
      console.log(res);
      return res?.data?.status;
    } catch (error) {
      console.error("Error getting response:", error)
      throw error
    }
  }

  const getReply = async (threadId: string) => {
    try {
      const message = await fetchData(`${API_URL}/openai/messagesList?threadId=${threadId}`, "GET") 
      console.log(message)
      const body = message.data.body
      const reply = body.data[0].content[0].text.value
      return reply
    } catch (error) {
      console.error("Error getting reply:", error)
      throw error
    }
  } 
  const deleteThread = async (id : string) => { 
    try { 
      const res = await fetchData(`${API_URL}/openai/deleteThread?threadId=${id}`); 
      return res
    } 
    catch (e) { 
     console.error('An Error Occured Deleting Thread',e);
    }
   }

  return { 
    createThread,
    createMessage,
    getRun,
    getResponse,
    getReply, 
    deleteThread,  
    AudioToText,
    createMessageWithImage,
    createMessageStream
  }
}

