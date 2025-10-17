import React from "react";
import ReactDOM from "react-dom/client";
import Chatbot from "./components/Chatbot";
import "./index.css";

// Widget initialization function
function initChatbot(elementId: string = "chatbot-widget") {
  const container = document.getElementById(elementId);

  if (!container) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Chatbot />
    </React.StrictMode>
  );
}

// Auto-initialize if element exists
if (document.getElementById("chatbot-widget")) {
  initChatbot();
}

// Expose to window for manual initialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).initChatbot = initChatbot;
