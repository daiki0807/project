import React from 'react';
import { ChatMessage, ChatRole } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === ChatRole.USER;
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser 
    ? 'bg-blue-600 text-white rounded-br-none' 
    : 'bg-gray-700 text-gray-200 rounded-bl-none';

  return (
    <div className={containerClasses}>
      <div className={`p-3 rounded-lg max-w-md md:max-w-lg lg:max-w-2xl ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap text-sm md:text-base">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
