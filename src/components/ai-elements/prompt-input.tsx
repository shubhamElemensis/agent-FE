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

  const get_assistant_response = async (user_input: string) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, sender: "user" },
      ]);
      setInputValue("");

      const assistantResponse = await get_assistant_response(inputValue);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: assistantResponse, sender: "bot" },
      ]);
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
