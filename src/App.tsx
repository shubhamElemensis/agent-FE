import React from "react";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="m-2 bottom-2 right-6 fixed">
      {!isOpen && (
        <div
          className="bg-gray-950 rounded-full size-14 flex items-center justify-center hover:cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div>💬</div>
        </div>
      )}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="font-bold">Chatbot</div>
            <button
              className="text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {/* Chat content goes here */}
            <p>Hello! How can I assist you today?</p>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              placeholder="Type your message..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
