
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, isLoading, children }) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-3 font-bold text-xl text-[#3D352E] rounded-lg border-2 border-[#3D352E] transition-all duration-200 focus:outline-none focus:ring-4 shadow-[4px_4px_0px_#3D352E]";
  const activeClasses = "bg-[#F97316] hover:bg-[#FB923C] focus:ring-[#F97316]/50 active:shadow-none active:translate-x-1 active:translate-y-1";
  const disabledClasses = "bg-[#A9A091] text-[#F3EADF] cursor-not-allowed shadow-none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
    >
      {children}
    </button>
  );
};