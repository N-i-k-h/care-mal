// src/components/Chat/Chat.js
import React, { useState, useEffect } from 'react';
import Message from './Message';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Simulate receiving a message
  useEffect(() => {
    // Replace this with actual logic to receive messages
    const interval = setInterval(() => {
      const newMessage = { text: `Message from ${user === 'doctor' ? 'user' : 'doctor'}`, sender: user === 'doctor' ? 'user' : 'doctor' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    const newMessage = { text: message, sender: user };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} user={user} />
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-300 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded-l"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
