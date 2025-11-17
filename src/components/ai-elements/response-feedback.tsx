import { useState } from "react";

interface ResponseFeedbackProps {
  messageIndex: number;
  onFeedback: (messageIndex: number, isRelevant: boolean) => void;
}

export default function ResponseFeedback({
  messageIndex,
  onFeedback,
}: ResponseFeedbackProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (isRelevant: boolean) => {
    setFeedbackGiven(true);
    onFeedback(messageIndex, isRelevant);
  };

  if (feedbackGiven) {
    return (
      <div className="mt-2 text-xs text-gray-600 italic">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <p className="text-xs text-gray-600 mb-2">
        Is this response related to your query?
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback(true)}
          className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-green-600 hover:text-white rounded-md transition-colors hover:cursor-pointer"
        >
          Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-red-600 hover:text-white rounded-md transition-colors hover:cursor-pointer"
        >
          No
        </button>
      </div>
    </div>
  );
}
