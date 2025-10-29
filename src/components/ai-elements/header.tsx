import React from "react";
import { IoMdClose } from "react-icons/io";

export default function header({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="p-2 bg-teal-600 flex justify-between items-center rounded-t-lg">
      <img src="/logo/logo.svg" alt="logo" className="w-30 h-10" />
      <button onClick={() => setIsOpen(false)} className="p-2 ">
        <IoMdClose size={25} className="text-white hover:cursor-pointer" />
      </button>
    </div>
  );
}
