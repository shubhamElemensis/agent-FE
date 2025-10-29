import React from "react";
import PromptInput from "./ai-elements/prompt-input";
import Header from "./ai-elements/header";
import Conversation from "./ai-elements/conversation";

interface ChatBotWidgetProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatBotWidget({ setIsOpen }: ChatBotWidgetProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full">
      <Header setIsOpen={setIsOpen} />
      <Conversation messages={messages} />
      <PromptInput setMessages={setMessages} />
    </div>
  );
}
