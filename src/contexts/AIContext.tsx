/* eslint-disable react-refresh/only-export-components */
import { getContentFromChunk } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Message {
  type: "text" | "tool_calls";
  content: string;
  role: "user" | "assistant";
  isComplete?: boolean;
}

interface AIContextType {
  messages: Message[];
  handleOnSubmit: (message: Message) => Promise<void>;
  isLoading: boolean;
  handleFeedback: (messageIndex: number, isRelevant: boolean) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
        isComplete: false,
      },
    ]);

    // Call the API to get the assistant's response
    try {
      const response = await fetch(`${baseURL}/chat`, {
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
      let buffer = ""; // Buffer to handle incomplete JSON objects
      let messageType: "text" | "tool_calls" = "text";
      let hasToolCalls = false; // Track if we've seen a tool_calls message

      while (true) {
        const { done, value } = await data!.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        buffer += chunk;

        // Split by newlines to get complete JSON objects
        const lines = buffer.split('\n');

        // Keep the last line in buffer (might be incomplete)
        buffer = lines.pop() || "";

        // Process complete lines
        for (const line of lines) {
          if (!line.trim()) continue;

          const chunkData = getContentFromChunk(line);

          // Track if we've seen a tool_calls message
          if (chunkData.type === "tool_calls") {
            hasToolCalls = true;
            console.log("Detected tool_calls message");
          }

          // For content chunks after tool_calls, keep the tool_calls type
          if (chunkData.content) {
            if (hasToolCalls) {
              messageType = "tool_calls";
            } else if (chunkData.type) {
              messageType = chunkData.type;
            }

            accumulatedContent += chunkData.content;
            console.log("Received assistant message chunk:", chunkData.content, "Type:", messageType);

            // Update the message in real-time with accumulated content
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[assistantMessageIndex] = {
                type: messageType,
                content: accumulatedContent,
                role: "assistant",
                isComplete: false,
              };
              return newMessages;
            });
          }
        }
      }

      // Process any remaining buffered content
      if (buffer.trim()) {
        const chunkData = getContentFromChunk(buffer);
        if (chunkData.content) {
          accumulatedContent += chunkData.content;
          if (chunkData.type) {
            messageType = chunkData.type;
          }
        }
      }

      // Mark the message as complete
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          type: messageType,
          content: accumulatedContent,
          role: "assistant",
          isComplete: true,
        };
        return newMessages;
      });

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

  const handleFeedback = async (messageIndex: number, isRelevant: boolean) => {
    try {
      await fetch(`${baseURL}/feedback/response-relevance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIndex,
          isRelevant,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log("Feedback submitted:", { messageIndex, isRelevant });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <AIContext.Provider value={{ messages, handleOnSubmit, isLoading, handleFeedback }}>
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
