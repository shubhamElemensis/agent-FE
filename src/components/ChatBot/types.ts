/**
 * ChatBot Types
 * TypeScript type definitions for the ChatBot component
 */

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatBotProps {
  /**
   * Initial greeting message from the bot
   */
  initialMessage?: string;
  /**
   * Placeholder text for the input field
   */
  placeholder?: string;
  /**
   * Primary color for the chatbot UI
   */
  primaryColor?: string;
  /**
   * Bot name to display in header
   */
  botName?: string;
  /**
   * Custom handler for sending messages
   * If not provided, uses default mock response
   */
  onSendMessage?: (message: string) => Promise<string>;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Position of the chat widget
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /**
   * Enable/disable typing indicator
   */
  showTypingIndicator?: boolean;
  /**
   * Enable/disable message timestamps
   */
  showTimestamps?: boolean;
  /**
   * Maximum height of the chat window
   */
  maxHeight?: string;
}

export interface ChatMessageProps {
  message: Message;
  showTimestamp?: boolean;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface TypingIndicatorProps {
  show: boolean;
}
