import { useAI } from "@/contexts/AIContext";
import { useState } from "react";
import { FaCircleArrowUp } from "react-icons/fa6";

export default function PromptInput() {
  const [inputValue, setInputValue] = useState<string>("");
  const { handleOnSubmit } = useAI();

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setInputValue("");

      await handleOnSubmit({ type: "text", content: inputValue, role: "user" });
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
