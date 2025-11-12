import React from "react";
import { IoMdClose } from "react-icons/io";
import { MdInfo } from "react-icons/md";

export default function header({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      {/* Header with logo and close button */}
      <div className="p-3 bg-teal-600 flex justify-between items-center rounded-t-lg">
        <img
          src="https://jl-pricing.vercel.app/images/logo.svg"
          alt="logo"
          className="w-30 h-10"
        />
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-teal-700 rounded transition-colors"
        >
          <IoMdClose size={24} className="text-white hover:cursor-pointer" />
        </button>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <MdInfo className="text-gray-500 flex-shrink-0 mt-0.5" size={16} />
          <p className="leading-relaxed">
            This chat session is recorded and may be monitored or reviewed by
            Juniorlogs.
          </p>
        </div>
      </div>
    </div>
  );
}
