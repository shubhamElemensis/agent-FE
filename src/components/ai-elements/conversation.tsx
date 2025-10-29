interface ConversationProps {
  messages: {
    text: string;
    sender: "user" | "bot";
  }[];
}

export default function Conversation({ messages }: ConversationProps) {
  return (
    <div className="p-4 flex-1 overflow-y-auto space-y-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.sender === "user" ? "text-right" : "text-left"}
        >
          <span
            className={`inline-block px-3 py-2 rounded-lg ${
              msg.sender === "user" ? " text-black" : " text-slate-500 "
            }`}
          >
            {msg.text}
          </span>
        </div>
      ))}
    </div>
  );
}
