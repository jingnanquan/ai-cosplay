import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "正在为你化妆和换装...", 
  subMessage = "AI 造型师正在为你打造专属Cosplay造型..." 
}) => (
  <div className="py-12 flex flex-col items-center justify-center text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#F97316]"></div>
    <p className="mt-4 text-[#5C554D] text-lg">{message}</p>
    <p className="text-base text-[#A9A091]">{subMessage}</p>
  </div>
);