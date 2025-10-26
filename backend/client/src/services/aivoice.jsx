import React, { useState } from "react";

const AIVoice = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      setConversation((prev) => [...prev, { sender: "You", text: userText }]);
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json();
      setLoading(false);
      speak(data.reply);
      setConversation((prev) => [...prev, { sender: "VetAI", text: data.reply }]);
    };
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">🐾 Veterinary Voice Assistant</h1>
        <div className="h-72 overflow-y-auto border p-4 mb-4 rounded-lg bg-green-50">
          {conversation.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && <p className="italic text-gray-500">Analyzing...</p>}
        </div>
        <button
          onClick={handleVoice}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          🎤 Start Voice Consultation
        </button>
      </div>
    </div>
  );
};

export default AIVoice;
