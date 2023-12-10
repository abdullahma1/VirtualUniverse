import React, { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const chat = async (message) => {
    setLoading(true);

    const response = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      console.error(`Error fetching chat data. Status: ${response.status}`);
      return;
    }
    
    try {
      const responseData = await response.json();
      const { messages: responseMessages } = responseData;
      setMessages((existingMessages) => [...existingMessages, ...responseMessages]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((existingMessages) => existingMessages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  const chatContextValue = {
    chat,
    message,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  };

  return <ChatContext.Provider value={chatContextValue}>{children}</ChatContext.Provider>;
};

export { ChatProvider, useChat };
