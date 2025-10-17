import { FC, useState, useEffect, useRef } from 'react';
import { ChatBotProps, Message } from './types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

/**
 * ChatBot Component
 *
 * A feature-rich, accessible chatbot UI component with:
 * - Typing indicators
 * - Auto-scroll behavior
 * - Message timestamps
 * - Smooth animations
 * - Customizable appearance
 * - Keyboard navigation
 *
 * @example
 * <ChatBot
 *   botName="Support Bot"
 *   initialMessage="Hello! How can I help you today?"
 *   onSendMessage={async (msg) => {
 *     const response = await fetchBotResponse(msg);
 *     return response;
 *   }}
 * />
 */
export const ChatBot: FC<ChatBotProps> = ({
  initialMessage = 'Hello! How can I help you today?',
  placeholder = 'Type a message...',
  botName = 'Chat Support',
  onSendMessage,
  className = '',
  position = 'bottom-right',
  showTypingIndicator = true,
  showTimestamps = true,
  maxHeight = '32rem',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Default message handler
  const defaultMessageHandler = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple response logic
    const responses = [
      "Thanks for your message! I'm here to help.",
      'I understand. Let me assist you with that.',
      "That's a great question! Here's what I can tell you...",
      'I appreciate you reaching out. How else can I help?',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get bot response
      const handler = onSendMessage || defaultMessageHandler;
      const botResponseText = await handler(inputValue);

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      role="complementary"
      aria-label="Chat widget"
    >
      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="mb-4 w-96 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out transform"
          style={{ height: maxHeight }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-header"
        >
          {/* Header */}
          <div
            id="chat-header"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-lg">{botName}</h3>
                <p className="text-xs text-blue-100">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 rounded p-1"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2"
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                showTimestamp={showTimestamps}
              />
            ))}
            {showTypingIndicator && <TypingIndicator show={isTyping} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            placeholder={placeholder}
            disabled={isTyping}
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen ? 'rotate-0' : ''
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Unread indicator (optional enhancement) */}
      {!isOpen && messages.length > 1 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {messages.filter((m) => m.sender === 'bot').length - 1}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
