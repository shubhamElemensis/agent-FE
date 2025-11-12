import React from "react";
import ChatBotWidget from "./components/ChatBotWidget";

export default function App() {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);

  const handleOpen = () => {
    setShowChat(true);
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowChat(false);
    }, 300); // Match the transition duration
  };

  return (
    <div className="m-2 bottom-2 right-6 fixed z-50">
      {!showChat && (
        <div
          className="bg-teal-600 rounded-full size-14 flex items-center justify-center hover:cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-xl shadow-md animate-bounce-once"
          onClick={handleOpen}
        >
          <img
            src="https://jl-pricing.vercel.app/images/mini-logo.svg"
            alt="mini-logo"
            className="size-6 transition-transform duration-300 hover:rotate-12"
          />
        </div>
      )}
      {showChat && (
        <div
          className={`w-[25rem] h-[45rem] bg-white shadow-2xl rounded-lg flex flex-col transition-all duration-300 ease-out origin-bottom-right ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0 rotate-0"
              : "opacity-0 scale-90 translate-y-8 rotate-2"
          }`}
        >
          <ChatBotWidget setIsOpen={handleClose} />
        </div>
      )}
    </div>
  );
}
