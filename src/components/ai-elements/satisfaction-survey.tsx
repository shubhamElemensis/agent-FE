import { useState } from "react";

interface SatisfactionSurveyProps {
  onClose: () => void;
  onSubmit: (rating: "satisfied" | "neutral" | "unsatisfied") => void;
}

export default function SatisfactionSurvey({
  onClose,
  onSubmit,
}: SatisfactionSurveyProps) {
  const [selectedRating, setSelectedRating] = useState<
    "satisfied" | "neutral" | "unsatisfied" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedRating) return;

    setIsSubmitting(true);
    onSubmit(selectedRating);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80 mx-4">
        <h3 className=" font-semibold text-gray-800 mb-2 text-center">
          Are you satisfied with the chatbot answer?
        </h3>

        <div className="flex justify-around mb-6">
          <button
            onClick={() => setSelectedRating("satisfied")}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              selectedRating === "satisfied"
                ? "scale-110"
                : "scale-100 hover:scale-105"
            }`}
          >
            <span className="text-5xl transition-all duration-300 hover:scale-125 hover:cursor-pointer">
              😊
            </span>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                selectedRating === "satisfied"
                  ? "text-teal-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              Satisfied
            </span>
          </button>

          <button
            onClick={() => setSelectedRating("neutral")}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              selectedRating === "neutral"
                ? "scale-110"
                : "scale-100 hover:scale-105"
            }`}
          >
            <span className="text-5xl transition-all duration-300 hover:scale-125 hover:cursor-pointer">
              😐
            </span>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                selectedRating === "neutral"
                  ? "text-teal-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              Neutral
            </span>
          </button>

          <button
            onClick={() => setSelectedRating("unsatisfied")}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              selectedRating === "unsatisfied"
                ? "scale-110"
                : "scale-100 hover:scale-105"
            }`}
          >
            <span className="text-5xl transition-all duration-300 hover:scale-125 hover:cursor-pointer">
              🙁
            </span>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                selectedRating === "unsatisfied"
                  ? "text-teal-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              Unsatisfied
            </span>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRating || isSubmitting}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">
          Your feedback helps us improve our service
        </p>
      </div>
    </div>
  );
}
