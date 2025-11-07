/* eslint-disable react-refresh/only-export-components */
import { getContentFromChunk } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Message {
  type: "text";
  content: string;
  role: "user" | "assistant";
}

interface AIContextType {
  messages: Message[];
  handleOnSubmit: (message: Message) => Promise<void>;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Current messages in AIProvider:", messages);

  const handleOnSubmit = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Add a placeholder message for the assistant's response
    const assistantMessageIndex = updatedMessages.length;
    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        content: "",
        role: "assistant",
      },
    ]);

    // Call the API to get the assistant's response
    try {
      const response = await fetch(`https://chatbot-api.juniorlogs.com/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            type: "text",
            content: "Error: Unable to get response from assistant.",
            role: "assistant",
          };
          return newMessages;
        });
        return;
      }

      const data = await response.body?.getReader();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await data!.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const content = getContentFromChunk(chunk);

        if (content) {
          accumulatedContent += content;
          console.log("Received assistant message chunk:", content);

          // Update the message in real-time with accumulated content
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[assistantMessageIndex] = {
              type: "text",
              content: accumulatedContent,
              role: "assistant",
            };
            return newMessages;
          });
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          type: "text",
          content: "Error: Failed to connect to the assistant.",
          role: "assistant",
        };
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider value={{ messages, handleOnSubmit, isLoading }}>
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
