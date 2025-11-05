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
  let currentList: string[] = [];
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
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ol>
      );
      currentList = [];
    }
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
      // Parse bold text within list items
      const formattedContent = content.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-slate-900">$1</strong>'
      );
      currentList.push(formattedContent);
      return;
    }

    // Flush any pending list before processing other elements
    flushList();

    // Handle links (View Screenshot or other links)
    const linkMatch = trimmedLine.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;

      // Check if it's a screenshot/image link
      const isImage =
        linkText.toLowerCase().includes("screenshot") ||
        url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

      if (isImage) {
        elements.push(
          <div key={`link-${idx}`} className="my-2">
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
        elements.push(
          <a
            key={`link-${idx}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm my-1"
          >
            <span>{linkText}</span>
          </a>
        );
      }
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

    // Handle regular paragraphs with bold text
    const formattedLine = trimmedLine.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-slate-900">$1</strong>'
    );
    elements.push(
      <p
        key={`para-${idx}`}
        className="text-slate-700 leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
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

export default function Conversation() {
  const { messages, isLoading } = useAI();
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // console.log("Messages in Conversation:", messages);
  return (
    <div className="p-4 flex-1 overflow-y-auto space-y-4">
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
      <div ref={conversationEndRef} />
    </div>
  );
}
