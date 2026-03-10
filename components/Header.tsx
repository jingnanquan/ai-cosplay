import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="py-4 md:py-6 bg-[#FFFBF5]/80 backdrop-blur-sm border-b-2 border-[#3D352E] sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <LogoIcon />
        <h1 className="text-3xl md:text-4xl font-display ml-3 text-[#3D352E]">
          一键Cosplay生成器
        </h1>
      </div>
    </header>
  );
};