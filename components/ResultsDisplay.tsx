import React from 'react';
import { ActionButton } from './ActionButton';
import { HomeIcon } from './Icons';

interface ResultsDisplayProps {
  originalImage: string;
  transformedImage: string;
  responseText: string | null;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, transformedImage, responseText, onReset }) => {
  return (
    <div className="px-6 md:px-10 pb-10 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-display text-[#3D352E] mb-3">原始图片</h3>
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/50 shadow-lg border-2 border-[#3D352E]">
            <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-display text-[#F97316] mb-3">Cosplay 效果</h3>
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-white/50 shadow-lg border-4 border-[#F97316]">
            <img src={transformedImage} alt="Transformed" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      {responseText && (
        <div className="mt-8 p-4 bg-[#FFFBF5] rounded-lg border-2 border-dashed border-[#A9A091]">
          <h4 className="font-display text-xl text-[#F97316] mb-2">AI 造型师点评:</h4>
          <p className="text-[#5C554D] text-base">{responseText}</p>
        </div>
      )}
      <div className="mt-10 text-center">
        <ActionButton onClick={onReset} disabled={false} isLoading={false}>
          <HomeIcon />
          继续变身
        </ActionButton>
      </div>
    </div>
  );
};