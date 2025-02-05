// 'use client'
// import React, { useEffect, useState } from 'react'
// import { io, Socket } from 'socket.io-client';
// const page = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

//   useEffect(() => {
//     const socket: Socket = io('http://localhost:3011');
//     setSocket(socket);

//     // Initialize AudioContext once when the component mounts
//     const context = new AudioContext({ sampleRate: 24000 }); 
//     setAudioContext(context);

//     // Listen for incoming audio chunks
//     socket.on('audio_chunk', (chunk: ArrayBuffer) => {
//       console.log('Received audio chunk');
//       playAudioChunk(chunk, context);
//     });

//     // Listen for the end of audio stream
//     socket.on('audio_end', () => {
//       console.log('Audio stream ended');
//     });

//     return () => {
//       socket.disconnect();
//       context.close();  // Close the audio context when the component unmounts
//     };
//   }, []);

//   function startTTS() {
//     console.log('Starting TTS streaming');
//     if (socket) {
//       socket.emit('startTTS', { message: "hello zain how are you today thank you" });
//     }
//   }

//   // Play the received audio chunk using Web Audio API
//   const playAudioChunk = async (chunk: ArrayBuffer, audioContext: AudioContext) => {
//     if (!audioContext) {
//       console.error('AudioContext is not initialized');
//       return;
//     }
  
//     if (audioContext.state === 'suspended') {
//       await audioContext.resume();
//     }
  
//     audioContext.decodeAudioData(chunk)
//       .then((buffer: AudioBuffer) => {
//         const audioSource = audioContext.createBufferSource();
//         audioSource.buffer = buffer;
//         audioSource.connect(audioContext.destination);
//         audioSource.start();
//         audioSource.onended = () => {
//           console.log('Audio chunk played');
//         };
//       })
//       .catch((error: any) => {
//         console.error('Error decoding audio data:', error);
//       });
//   };
  

//   return (
//     <div className='cursor-pointer' onClick={startTTS}>Test Audio Streaming</div>
//   );
// }

// export default page;


'use client'
import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client';

const Page = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioChunks, setAudioChunks] = useState<Uint8Array[]>([]);

  useEffect(() => {
    const newSocket: Socket = io('http://localhost:3011');
    setSocket(newSocket);

    const context = new AudioContext({ sampleRate: 24000 });
    setAudioContext(context);

    newSocket.on('audio_chunk', (chunk: ArrayBuffer) => {
      console.log('Received audio chunk');
      setAudioChunks(prevChunks => [...prevChunks, new Uint8Array(chunk)]);
    });

    newSocket.on('audio_end', () => {
      console.log('Audio stream ended');
      playBufferedAudio(audioChunks, context);
      setAudioChunks([]); // Clear buffer after playback
    });

    return () => {
      newSocket.disconnect();
      context.close();
    };
  }, []);

  function startTTS() {
    console.log('Starting TTS streaming');
    if (socket) {
      socket.emit('startTTS', { message: "hello Zain, how are you today? Thank you." });
    }
  }

  const playBufferedAudio = async (chunks: Uint8Array[], audioContext: AudioContext) => {
    if (!audioContext) {
      console.error('AudioContext is not initialized');
      return;
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const concatenatedBuffer = concatChunksToWAV(chunks, 24000);
    
    audioContext.decodeAudioData(concatenatedBuffer)
      .then((buffer: AudioBuffer) => {
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
        audioSource.onended = () => console.log('Audio played successfully');
      })
      .catch((error: any) => console.error('Error decoding audio:', error));
  };

  return (
    <div className='cursor-pointer' onClick={startTTS}>Test Audio Streaming</div>
  );
};

export default Page;

// Helper function to convert PCM chunks into WAV
const concatChunksToWAV = (chunks: Uint8Array[], sampleRate = 24000) => {
  const pcmData = chunks.reduce((acc:any, val) => [...acc, ...val], []);
  const numFrames = pcmData.length / 2; // PCM16 = 2 bytes per sample
  const wavHeader = createWavHeader(numFrames, 1, sampleRate);
  return new Uint8Array([...new Uint8Array(wavHeader), ...pcmData]).buffer;
};

// Function to create a WAV file header
const createWavHeader = (numFrames: number, numChannels = 1, sampleRate = 24000, bytesPerSample = 2) => {
  const dataSize = numFrames * numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // File size
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  return buffer;
};
