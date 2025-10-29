import React from "react";
import ChatBotWidget from "./components/ChatBotWidget";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="m-2 bottom-2 right-6 fixed">
      {!isOpen && (
        <div
          className="bg-teal-600 rounded-full size-14 flex items-center justify-center hover:cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img src="/logo/mini-logo.svg" alt="mini-logo" className="size-6" />
        </div>
      )}
      {isOpen && (
        <div className="w-[25rem] h-[30rem] bg-white shadow-lg rounded-lg flex flex-col">
          <ChatBotWidget setIsOpen={setIsOpen} />
        </div>
      )}
    </div>
  );
}
