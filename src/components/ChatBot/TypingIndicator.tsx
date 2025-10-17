import { FC } from 'react';
import { TypingIndicatorProps } from './types';

/**
 * TypingIndicator Component
 *
 * Displays an animated typing indicator when the bot is "typing"
 *
 * @example
 * <TypingIndicator show={isTyping} />
 */
export const TypingIndicator: FC<TypingIndicatorProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="flex justify-start mb-3">
      <div className="bg-gray-200 rounded-lg px-4 py-3 max-w-xs">
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
