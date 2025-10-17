import { FC, KeyboardEvent } from 'react';
import { ChatInputProps } from './types';

/**
 * ChatInput Component
 *
 * Input field and send button for the chatbot
 *
 * @example
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSend={handleSend}
 *   placeholder="Type a message..."
 * />
 */
export const ChatInput: FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSendClick = () => {
    if (!disabled) {
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          aria-label="Message input"
          autoComplete="off"
        />
        <button
          onClick={handleSendClick}
          disabled={disabled || !value.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send
      </p>
    </div>
  );
};

export default ChatInput;
