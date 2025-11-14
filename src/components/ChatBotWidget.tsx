import React, { useState } from "react";
import PromptInput from "./ai-elements/prompt-input";
import Header from "./ai-elements/header";
import Conversation from "./ai-elements/conversation";
import SatisfactionSurvey from "./ai-elements/satisfaction-survey";
import { AIProvider, useAI } from "@/contexts/AIContext";

interface ChatBotWidgetProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBotContent({ setIsOpen }: ChatBotWidgetProps) {
  const [showSurvey, setShowSurvey] = useState(false);
  const { messages } = useAI();

  const handleCloseAttempt = () => {
    // Only show survey if there are messages
    if (messages.length > 0) {
      setShowSurvey(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSurveySubmit = async (rating: "satisfied" | "neutral" | "unsatisfied") => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      await fetch(`${baseURL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    setShowSurvey(false);
    setIsOpen(false);
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
    setIsOpen(false);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full relative">
      <Header setIsOpen={handleCloseAttempt} />
      <Conversation />
      <PromptInput />
      {showSurvey && (
        <SatisfactionSurvey
          onClose={handleSurveyClose}
          onSubmit={handleSurveySubmit}
        />
      )}
    </div>
  );
}

export default function ChatBotWidget({ setIsOpen }: ChatBotWidgetProps) {
  return (
    <AIProvider>
      <ChatBotContent setIsOpen={setIsOpen} />
    </AIProvider>
  );
}
