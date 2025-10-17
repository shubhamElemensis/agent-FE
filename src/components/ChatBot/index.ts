/**
 * ChatBot Component Barrel Export
 *
 * Main entry point for the ChatBot component and related types
 */

export { default as ChatBot } from './ChatBot';
export { default as ChatMessage } from './ChatMessage';
export { default as ChatInput } from './ChatInput';
export { default as TypingIndicator } from './TypingIndicator';

export type {
  Message,
  ChatBotProps,
  ChatMessageProps,
  ChatInputProps,
  TypingIndicatorProps,
} from './types';

// Default export
export { default } from './ChatBot';
