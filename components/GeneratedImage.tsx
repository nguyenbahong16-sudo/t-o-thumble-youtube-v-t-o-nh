import React from 'react';

interface GeneratedImageProps {
  images: string[] | null;
  isLoading: boolean;
  loadingMessage: string;
  onImageClick: (src: string) => void;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ images, isLoading, loadingMessage, onImageClick }) => {
  const placeholders = Array.from({ length: 4 });

  return (
    <div className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg flex flex-col gap-4 relative p-4">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
          <p className="mt-4 text-lg text-gray-300">{loadingMessage}</p>
        </div>
      )}
      
      {placeholders.map((_, index) => {
        const imageSrc = images?.[index];

        if (imageSrc) {
          // Nếu có hình ảnh cho vị trí này, hãy hiển thị nó cùng với nút tải xuống.
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <button 
                className="w-full aspect-video flex items-center justify-center bg-gray-900/50 rounded-md overflow-hidden relative group focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => onImageClick(imageSrc)}
                aria-label={`Xem ảnh thumbnail ${index + 1}`}
              >
                <img src={imageSrc} alt={`Thumbnail được tạo ${index + 1}`} className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
              <a
                href={imageSrc}
                download={`thumbnail-${index + 1}.jpeg`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-300"
                aria-label={`Tải xuống thumbnail ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Tải xuống</span>
              </a>
            </div>
          );
        } else {
          // Ngược lại, hiển thị một placeholder.
          return (
            <div key={index} className="w-full aspect-video bg-gray-900/50 rounded-md flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">Vị trí thumbnail {index + 1}</p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default GeneratedImage;