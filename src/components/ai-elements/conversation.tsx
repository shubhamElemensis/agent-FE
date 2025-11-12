import { useAI } from "@/contexts/AIContext";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div
        className="max-w-7xl max-h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}

function BotMessage({ text }: { text: string }) {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Parse the markdown-like text into structured content
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let currentList: ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ol
          key={`list-${listKey++}`}
          className="list-decimal pl-5 space-y-2 my-3"
        >
          {currentList.map((item, idx) => (
            <li
              key={idx}
              className="text-slate-700 leading-relaxed pl-1"
            >
              {item}
            </li>
          ))}
        </ol>
      );
      currentList = [];
    }
  };

  // Helper function to parse inline content (bold, links, images)
  const parseInlineContent = (content: string, keyPrefix: string) => {
    const result: ReactNode[] = [];
    let lastIndex = 0;

    // Find all markdown links [text](url)
    const linkRegex = /\[(.+?)\]\((.+?)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        const formattedText = textBefore.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="font-semibold text-slate-900">$1</strong>'
        );
        result.push(
          <span key={`${keyPrefix}-text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: formattedText }} />
        );
      }

      const linkText = match[1];
      const url = match[2];

      // Check if it's an image/screenshot link
      const isImage =
        linkText.toLowerCase().includes("screenshot") ||
        url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isImage) {
        result.push(
          <div key={`${keyPrefix}-img-${match.index}`} className="my-2">
            <button
              onClick={() => setSelectedImage({ src: url, alt: linkText })}
              className="block w-full text-left"
            >
              <img
                src={url}
                alt={linkText}
                className="rounded-lg border border-slate-200 max-w-full h-auto shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                loading="lazy"
              />
            </button>
          </div>
        );
      } else {
        result.push(
          <a
            key={`${keyPrefix}-link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm"
          >
            {linkText}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last link
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      const formattedText = textAfter.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-slate-900">$1</strong>'
      );
      result.push(
        <span key={`${keyPrefix}-text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    }

    return result;
  };

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      return;
    }

    // Handle numbered lists
    const listMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (listMatch) {
      const content = listMatch[2];
      const parsedContent = parseInlineContent(content, `list-${idx}`);
      currentList.push(<>{parsedContent}</>);
      return;
    }

    // Flush any pending list before processing other elements
    flushList();

    // Handle bullet points (*, -, +)
    const bulletMatch = trimmedLine.match(/^[*\-+]\s+(.+)$/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      elements.push(
        <div key={`bullet-${idx}`} className="flex gap-2 my-2">
          <span className="text-slate-700 mt-1">•</span>
          <div className="text-slate-700 leading-relaxed flex-1">
            {parseInlineContent(content, `bullet-${idx}`)}
          </div>
        </div>
      );
      return;
    }

    // Handle source/reference links
    if (trimmedLine.startsWith("📚 Source:")) {
      const sourceText = trimmedLine.replace("📚 Source:", "").trim();
      elements.push(
        <div
          key={`source-${idx}`}
          className="mt-4 pt-3 border-t border-slate-200"
        >
          <a
            href={sourceText}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 break-all"
          >
            <span className="text-base flex-shrink-0">📚</span>
            <span className="hover:underline">Source: {sourceText}</span>
          </a>
        </div>
      );
      return;
    }

    // Handle regular paragraphs
    const parsedContent = parseInlineContent(trimmedLine, `para-${idx}`);
    elements.push(
      <p key={`para-${idx}`} className="text-slate-700 leading-relaxed my-2">
        {parsedContent}
      </p>
    );
  });

  // Flush any remaining list items
  flushList();

  return (
    <>
      <div className="space-y-1">{elements}</div>
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

const SAMPLE_QUESTIONS = [
  "How do I submit RS7 Return?",
  "Fresh Booking Rule ECE",
  "How to process refund payments?",
];

export default function Conversation() {
  const { messages, isLoading, handleOnSubmit } = useAI();
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSampleQuestionClick = (question: string) => {
    handleOnSubmit({
      type: "text",
      content: question,
      role: "user",
    });
  };

  // console.log("Messages in Conversation:", messages);
  return (
    <div className="p-4 flex-1 overflow-y-auto space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="space-y-3 max-w-md w-full">
            <h3 className="text-center text-slate-600 text-sm font-medium mb-4">
              Try asking:
            </h3>
            {SAMPLE_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestionClick(question)}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm text-slate-700 hover:text-slate-900"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : msg.content === "" && isLoading ? (
                  <TypingIndicator />
                ) : (
                  <BotMessage text={msg.content} />
                )}
              </div>
            </div>
          ))}
        </>
      )}
      <div ref={conversationEndRef} />
    </div>
  );
}
