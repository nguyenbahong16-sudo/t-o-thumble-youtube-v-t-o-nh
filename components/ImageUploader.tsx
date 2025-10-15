
import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, preview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  }, [onImageSelect]);


  return (
    <div 
      className="w-full aspect-video bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-gray-700/50 transition-all duration-300 p-2"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {preview ? (
        <img src={preview} alt="Xem trước tham chiếu" className="max-w-full max-h-full object-contain rounded-md" />
      ) : (
        <div className="text-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2">Nhấp hoặc kéo và thả ảnh vào đây</p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP, v.v.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
   