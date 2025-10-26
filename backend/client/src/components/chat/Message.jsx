// src/components/Chat/Message.js
import React from 'react';

const Message = ({ message, user }) => {
  return (
    <div className={`mb-2 ${message.sender === user ? 'text-right' : 'text-left'}`}>
      <span className={`inline-block p-2 rounded ${message.sender === user ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
        {message.text}
      </span>
    </div>
  );
};

export default Message;
