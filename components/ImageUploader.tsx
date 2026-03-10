import React, { useCallback, useRef } from 'react';
import { UploadIcon, CloseIcon } from './Icons';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  onFileRemove?: () => void;
  currentImagePreview: string | null;
  promptText?: string;
  subPromptText?: string;
  heightClass?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onFileSelect, 
  onFileRemove,
  currentImagePreview, 
  promptText = "点击或拖拽图片到这里", 
  subPromptText = "支持 PNG, JPG, WEBP",
  heightClass = "h-64"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (e.target !== fileInputRef.current) {
        e.preventDefault();
        fileInputRef.current?.click();
    }
  }

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onFileRemove) {
      onFileRemove();
      // Reset the file input value so that the user can re-upload the same file if they want
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleLabelClick}
        className={`cursor-pointer w-full ${heightClass} flex flex-col items-center justify-center border-2 border-dashed border-[#A9A091] rounded-xl hover:border-[#F97316] hover:bg-[#F3EADF]/50 transition-all duration-300 relative overflow-hidden group bg-white/50`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()} 
        />
        {currentImagePreview ? (
          <>
            {onFileRemove && (
              <button 
                onClick={handleRemoveClick} 
                className="absolute top-2 right-2 z-10 p-1.5 bg-[#3D352E]/60 rounded-full text-white hover:bg-[#3D352E]/90 transition-colors"
                aria-label="Remove image"
              >
                <CloseIcon />
              </button>
            )}
            <img src={currentImagePreview} alt="Preview" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-bold">更换图片</span>
            </div>
          </>
        ) : (
          <div className="text-center text-[#A9A091] p-4">
            <UploadIcon />
            <p className="mt-2 font-semibold text-lg">{promptText}</p>
            <p className="text-sm text-[#A9A091]">{subPromptText}</p>
          </div>
        )}
      </label>
    </div>
  );
};