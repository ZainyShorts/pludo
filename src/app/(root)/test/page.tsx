// 'use client'
// import { useState, useEffect } from 'react';

// export default function SSEPage() {
//   const [messages, setMessages] = useState<any>([]);
//   useEffect(() => {
//     // Create an EventSource to listen to SSE events
//     const eventSource = new EventSource('http://localhost:3011/openai/stream');
//     // Handle incoming messages
//     eventSource.onmessage = (event:any) => {
//         console.log(event.data)
//     //   const data = JSON.parse(event.data);
//       setMessages((prevMessages:any) => [...prevMessages, event.data]);
//     };
//     // Handle errors
//     eventSource.onerror = () => {
//       console.error('Error connecting to SSE server.');
//       eventSource.close();
//     };
//     // Cleanup on unmount
//     return () => {
//       eventSource.close();
//     };
//   }, []);
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Server-Sent Events (SSE) with Next.js</h1>
//       <div>
//         {messages.map((message:any, index:number) => (
//           <p key={index}>Message received at: {message}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client'
import { useState } from 'react';

export default function SSEPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendDataAndStreamResponse = async () => {
    setMessages([]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3011/openai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
             assistantType:"BUSINESS_DEVELOPMENT",
             subType:"STRATEGIC_PLANNING_AGENT", 
             userPrompt:"cat",
             token: 20
             }), // Customize payload
      });

      if (!response.body) {
        throw new Error('No response body');
      }

    const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => [...prev, chunk]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Streaming Response with Fetch</h1>
      <button onClick={sendDataAndStreamResponse} disabled={loading}>
        {loading ? 'Streaming...' : 'Start Streaming'}
      </button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
