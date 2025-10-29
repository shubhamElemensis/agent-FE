import { useState } from "react";
import { FaCircleArrowUp } from "react-icons/fa6";

interface PromptInputProps {
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        text: string;
        sender: "user" | "bot";
      }[]
    >
  >;
}

export default function PromptInput({ setMessages }: PromptInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, sender: "user" },
      ]);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "This is a placeholder response from the bot.",
            sender: "bot",
          },
        ]);
      }, 1000);
      setInputValue("");
    }
  };

  return (
    <div>
      <form action={handleSubmit} className="p-2 border-t flex space-x-2">
        <input
          type="text"
          placeholder="What would you like to know?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2  rounded focus:outline-none text-sm"
        />
        <button
          className="p-2"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
        >
          <FaCircleArrowUp
            size={25}
            className="text-teal-600 hover:cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
}
