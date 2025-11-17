import { useAI } from "@/contexts/AIContext";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { HiMicrophone } from "react-icons/hi2";
import { IoMdAttach } from "react-icons/io";

export default function PromptInput() {
  const [inputValue, setInputValue] = useState<string>("");
  const { handleOnSubmit } = useAI();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setInputValue("");

      await handleOnSubmit({ type: "text", content: inputValue, role: "user" });

      // Re-focus input after submission
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2 bg-white border-2 border-gray-900 rounded-full px-4 py-2">
        {/* Left icons */}
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label="Add emoji"
        >
          <HiOutlineEmojiHappy size={20} className="text-gray-600" />
        </button>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-500"
        />

        {/* Right icons */}
        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label="Voice input"
        >
          <HiMicrophone size={20} className="text-gray-600" />
        </button>

        <button
          type="button"
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 "
          aria-label="Attach file"
        >
          <IoMdAttach size={20} className="text-gray-600" />
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className={`p-2 rounded-full transition-all flex-shrink-0 ${
            inputValue.trim()
              ? "bg-teal-700 hover:bg-teal-800 hover:cursor-pointer"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <IoSend
            size={16}
            className={inputValue.trim() ? "text-white" : "text-gray-400"}
          />
        </button>
      </div>
    </div>
  );
}
