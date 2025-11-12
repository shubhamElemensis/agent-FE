import { useAI } from "@/contexts/AIContext";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
}

function ImageWithSkeleton({
  src,
  alt,
  onClick,
  className,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onClick={onClick}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Failed to load image</p>
        </div>
      )}
    </div>
  );
}

function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
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
    </div>,
    document.body
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
        <ul key={`list-${listKey++}`} className="space-y-1.5 my-2">
          {currentList.map((item, idx) => (
            <li
              key={idx}
              className="text-[14px] text-gray-900 font-normal leading-normal pl-1 break-words"
            >
              {item}
            </li>
          ))}
        </ul>
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
          '<strong class="font-semibold text-gray-900 text-[14px]">$1</strong>'
        );
        result.push(
          <span
            key={`${keyPrefix}-text-${lastIndex}`}
            className="text-[14px]"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
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
              <ImageWithSkeleton
                src={url}
                alt={linkText}
                onClick={() => {}}
                className="rounded-lg border border-gray-200 max-w-full h-auto shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-[14px]"
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
        '<strong class="font-semibold text-gray-900 text-[14px]">$1</strong>'
      );
      result.push(
        <span
          key={`${keyPrefix}-text-${lastIndex}`}
          className="text-[14px]"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
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
        <div key={`bullet-${idx}`} className="flex gap-2 my-1.5">
          <span className="text-[14px] text-gray-900 font-normal mt-0.5">
            •
          </span>
          <div className="text-[14px] text-gray-900 font-normal leading-normal flex-1 break-words">
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
          className="mt-3 pt-2 border-t border-gray-200"
        >
          <a
            href={sourceText}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] text-gray-600 hover:text-gray-800 break-all overflow-wrap-anywhere"
          >
            <span className="text-sm flex-shrink-0">📚</span>
            <span className="hover:underline break-all">
              Source: {sourceText}
            </span>
          </a>
        </div>
      );
      return;
    }

    // Handle regular paragraphs
    const parsedContent = parseInlineContent(trimmedLine, `para-${idx}`);
    elements.push(
      <p
        key={`para-${idx}`}
        className="text-[14px] text-gray-900 font-normal leading-normal my-1.5 break-words"
      >
        {parsedContent}
      </p>
    );
  });

  // Flush any remaining list items
  flushList();

  return (
    <>
      <div className="space-y-0.5 text-[14px]">{elements}</div>
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
  "How to add a vacation register?",
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
    <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col h-full">
          {/* Initial Bot Response */}
          <div className="bg-[#E5E7EB] rounded-2xl rounded-tl-none px-4 py-3 mb-4 max-w-[85%]">
            <p className="text-[14px] text-gray-900 font-normal leading-normal">
              You can ask questions here. How can I help?
            </p>
          </div>

          {/* Suggested Questions */}
          <div className="space-y-2 mt-auto">
            {SAMPLE_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestionClick(question)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white hover:bg-gray-50 transition-colors text-[14px] text-gray-900 font-medium shadow-sm border border-gray-100"
              >
                <span>{question}</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
                className={`max-w-[95%] rounded-2xl px-4 py-3 break-words overflow-wrap-anywhere ${
                  msg.role === "user"
                    ? "bg-teal-700 text-white rounded-tr-none"
                    : "bg-[#E5E7EB] text-gray-900 rounded-tl-none"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-[14px] font-normal leading-normal">
                    {msg.content}
                  </p>
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
