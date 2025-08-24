
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type ChatMessage, ChatRole } from './types';
import { createChatSession } from './services/geminiService';
import Header from './components/Header';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';
import { type Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    try {
      const newChat = createChatSession();
      setChat(newChat);
    } catch (e) {
      console.error(e);
      setError("Failed to initialize chat session. Please check your API key.");
    }
  }, []);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!chat || isLoading) return;

    setIsLoading(true);
    setError(null);
    const userMessage: ChatMessage = { role: ChatRole.USER, text: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      let fullResponse = "";
      const stream = await chat.sendMessageStream({ message: userInput });

      // Create a placeholder for the AI's response
      const modelMessage: ChatMessage = { role: ChatRole.MODEL, text: "" };
      setMessages(prevMessages => [...prevMessages, modelMessage]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: fullResponse };
          return newMessages;
        });
      }

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get response from AI: ${errorMessage}`);
      const errorResponseMessage: ChatMessage = { role: ChatRole.MODEL, text: "申し訳ありません、応答の取得中にエラーが発生しました。" };
      setMessages(prevMessages => [...prevMessages.slice(0, -1), errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessageComponent key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length -1]?.role === ChatRole.USER && (
           <div className="flex justify-start">
             <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 max-w-lg">
                <LoadingSpinner />
                <span className="text-gray-400">AIが応答を生成中です...</span>
              </div>
           </div>
        )}
      </main>
      {error && (
        <div className="p-4 bg-red-800 text-white text-center">
          <p>{error}</p>
        </div>
      )}
      <footer className="p-4 md:p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
