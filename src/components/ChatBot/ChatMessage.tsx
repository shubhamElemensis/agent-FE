import { FC } from 'react';
import { ChatMessageProps } from './types';

/**
 * ChatMessage Component
 *
 * Displays a single chat message with styling based on sender
 *
 * @example
 * <ChatMessage message={msg} showTimestamp={true} />
 */
export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  showTimestamp = true,
}) => {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`${isUser ? 'Your' : 'Bot'} message`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-lg transition-all duration-200 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        } ${message.isStreaming ? 'animate-pulse' : ''}`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">
          {message.text}
        </p>
        {showTimestamp && (
          <span
            className={`text-xs mt-1 block ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}
            aria-label="Message time"
          >
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
