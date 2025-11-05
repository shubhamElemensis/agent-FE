import React from "react";
import PromptInput from "./ai-elements/prompt-input";
import Header from "./ai-elements/header";
import Conversation from "./ai-elements/conversation";
import { AIProvider } from "@/contexts/AIContext";

interface ChatBotWidgetProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatBotWidget({ setIsOpen }: ChatBotWidgetProps) {
  return (
    <AIProvider>
      <div className="grid grid-rows-[auto_1fr_auto] h-full">
        <Header setIsOpen={setIsOpen} />
        <Conversation />
        <PromptInput />
      </div>
    </AIProvider>
  );
}
