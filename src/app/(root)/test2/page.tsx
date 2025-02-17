'use client'
import React, { useState, useRef } from "react";

function App() {
    const [text, setText] = useState("");
    const audioRef = useRef<any>(null);

    const handleConvertTextToSpeech = async () => {
        try {
            const response = await fetch("https://brandsblitz.xyz/service1/openai/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputText:text ,userId:"deScopeId"}), // Sending text as JSON
            });

            if (!response.ok) throw new Error("Failed to fetch audio");

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob); 
            console.log(audioUrl);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-red-400">
            <h1 className="mb-4 text-white text-2xl">Text to Speech Converter</h1>
            <textarea
                className="w-1/2 p-2 border rounded-md text-black"
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleConvertTextToSpeech}
            >
                Convert to Speech
            </button>
            <audio ref={audioRef} controls className="mt-4" />
        </div>
    );
}

export default App;