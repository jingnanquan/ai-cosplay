import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { ActionButton } from './components/ActionButton';
import { changeOutfit } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { TransformResult } from './types';
import { TransformIcon, WandIcon, LightbulbIcon } from './components/Icons';

const BentoBox: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-[#F3EADF] rounded-2xl border-2 border-[#3D352E] shadow-[8px_8px_0px_#3D352E] p-6 ${className}`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  
  const [characterFile, setCharacterFile] = useState<File | null>(null);
  const [characterImagePreview, setCharacterImagePreview] = useState<string | null>(null);
  
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [transformResult, setTransformResult] = useState<TransformResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setOriginalFile(file);
    setTransformResult(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImagePreview(null);
    }
  };

  const handleRemoveOriginalFile = () => {
    setOriginalFile(null);
    setOriginalImagePreview(null);
    setTransformResult(null);
    setError(null);
  };

  const handleCharacterFileSelect = (file: File | null) => {
    setCharacterFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCharacterImagePreview(null);
    }
  };

  const handleRemoveCharacterFile = () => {
    setCharacterFile(null);
    setCharacterImagePreview(null);
  };

  const handleTransform = useCallback(async () => {
    if (!originalFile) {
      setError("请先选择一张你的照片。");
      return;
    }
    if (!characterPrompt.trim()) {
      setError("请输入一个动漫角色的名字。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransformResult(null);

    try {
      const userImage = await fileToBase64(originalFile);
      let characterImage = null;
      if (characterFile) {
        characterImage = await fileToBase64(characterFile);
      }
      
      const result = await changeOutfit(
        userImage.base64, 
        userImage.mimeType, 
        characterPrompt, 
        characterImage?.base64, 
        characterImage?.mimeType
      );
      setTransformResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "发生未知错误，请重试。");
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, characterFile, characterPrompt]);

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalImagePreview(null);
    setCharacterFile(null);
    setCharacterImagePreview(null);
    setCharacterPrompt('');
    setTransformResult(null);
    setIsLoading(false);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
       return <ErrorAlert message={error} />;
    }
    if (transformResult) {
      return (
         <ResultsDisplay 
            originalImage={originalImagePreview!} 
            transformedImage={transformResult.imageUrl}
            responseText={transformResult.text}
            onReset={handleReset}
          />
      );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Photo Uploader */}
            <BentoBox className="md:col-span-2 md:row-span-2 flex flex-col">
                <h3 className="text-2xl font-display text-[#F97316] mb-4">① 上传你的照片</h3>
                <div className="flex-grow">
                     <ImageUploader 
                        onFileSelect={handleFileSelect} 
                        onFileRemove={handleRemoveOriginalFile}
                        currentImagePreview={originalImagePreview} 
                        promptText="点击或拖拽你的照片到这里"
                        heightClass="h-full min-h-[250px]"
                    />
                </div>
            </BentoBox>

            {/* Character Definition */}
            <BentoBox className="md:col-start-3 flex flex-col">
                <h3 className="text-2xl font-display text-[#F97316] mb-4">② 定义角色</h3>
                <div>
                   <label htmlFor="character-prompt" className="block text-lg font-bold text-[#3D352E] mb-2">
                    你想 Cosplay 谁？
                  </label>
                  <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <WandIcon />
                    </div>
                    <input
                      type="text"
                      id="character-prompt"
                      value={characterPrompt}
                      onChange={(e) => setCharacterPrompt(e.target.value)}
                      placeholder="例如：鸣人、五条悟..."
                      className="block w-full text-lg rounded-lg border-2 border-[#3D352E] bg-white pl-10 pr-4 py-3 text-[#3D352E] placeholder-[#A9A091] focus:border-[#F97316] focus:ring-[#F97316] transition"
                    />
                  </div>
                </div>
                 <div className="mt-4">
                  <label className="block text-base font-bold text-[#3D352E] mb-2">
                    上传参考图 (可选)
                  </label>
                  <ImageUploader 
                    onFileSelect={handleCharacterFileSelect}
                    onFileRemove={handleRemoveCharacterFile}
                    currentImagePreview={characterImagePreview}
                    promptText="上传角色图"
                    heightClass="h-32"
                  />
                </div>
            </BentoBox>
            
            {/* Action Button */}
             <BentoBox className="md:col-start-3 flex flex-col items-center justify-center text-center">
                 <h3 className="text-2xl font-display text-[#F97316] mb-4">③ 开始变身！</h3>
                 <ActionButton
                    onClick={handleTransform}
                    disabled={!originalFile || !characterPrompt.trim() || isLoading}
                    isLoading={isLoading}
                  >
                    <TransformIcon />
                    {isLoading ? "正在为你变身..." : "开始Cosplay"}
                  </ActionButton>
            </BentoBox>

            {/* Tips Section */}
            <BentoBox className="md:col-span-3">
                 <h4 className="font-display text-xl text-[#F97316] mb-2 flex items-center">
                    <LightbulbIcon />
                    <span className="ml-2">想要更好的效果？试试这些小技巧</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-base text-[#5C554D]">
                    <li><strong>你的照片：</strong>使用光线良好、面部清晰、无遮挡的正面照。</li>
                    <li><strong>角色参考图：</strong>选择高清、能清晰展示服装和发型的图片。</li>
                    <li><strong>角色名：</strong>输入完整准确的角色名，可加上作品名（如：“火影忍者 鸣人”）。</li>
                </ul>
            </BentoBox>
        </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
             <div className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl md:text-5xl font-display text-black" style={{ textShadow: '2px 2px 0 #F97316' }}>
                涂鸦变身器
              </h2>
              <p className="text-[#5C554D] mt-2 text-lg max-w-2xl mx-auto">上传照片，指定角色，一键变身！AI 为你换上动漫服装，画上专属妆容。</p>
            </div>
            {renderContent()}
        </div>
      </main>
      <footer className="w-full bg-[#3D352E] py-4">
          <p className="text-center text-[#F3EADF] text-sm">由 Google Gemini AI 强力驱动</p>
      </footer>
    </div>
  );
};

export default App;