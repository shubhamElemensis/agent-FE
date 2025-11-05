/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Message {
  type: "text";
  content: string;
  role: "user" | "assistant";
}

interface AIContextType {
  messages: Message[];
  handleOnSubmit: (message: Message) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleOnSubmit = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Call the API to get the assistant's response
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            content: "Error: Unable to get response from assistant.",
            role: "assistant",
          },
        ]);
        return;
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "text", content: data.response, role: "assistant" },
      ]);
    } catch (error) {
      console.error("Error fetching assistant response:", error);
    }
  };

  return (
    <AIContext.Provider value={{ messages, handleOnSubmit }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
