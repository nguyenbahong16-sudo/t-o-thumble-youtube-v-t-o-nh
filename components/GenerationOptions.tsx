import React from 'react';

interface GenerationOptionsProps {
  selectedRatio: string;
  onChange: (ratio: string) => void;
  isDisabled: boolean;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerateFromPrompt: () => void;
  numberOfImages: number;
  onNumberOfImagesChange: (num: number) => void;
}

const RATIOS = ['16:9', '9:16', '4:3', '1:1'];
const NUM_OPTIONS = [1, 2, 3, 4];

const GenerationOptions: React.FC<GenerationOptionsProps> = ({ 
  selectedRatio, 
  onChange, 
  isDisabled,
  prompt,
  onPromptChange,
  onGenerateFromPrompt,
  numberOfImages,
  onNumberOfImagesChange
}) => {
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isDisabled) {
      onGenerateFromPrompt();
    }
  };

  return (
    <div className="w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-4">
      <div>
        <h3 className="text-md font-semibold text-gray-300 mb-3 text-center">Tỷ lệ khung hình</h3>
        <div className="flex justify-center items-center gap-3 flex-wrap">
          {RATIOS.map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => onChange(ratio)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500
                ${selectedRatio === ratio 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 my-1"></div>

      <div>
         <h3 className="text-md font-semibold text-gray-300 mb-3 text-center">Hoặc tạo bằng lời nhắc văn bản</h3>
         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
           <input
             type="text"
             value={prompt}
             onChange={(e) => onPromptChange(e.target.value)}
             placeholder="Ví dụ: một chú mèo phi hành gia trên sao Hỏa"
             className="w-full flex-grow bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
             disabled={isDisabled}
           />
           <div className="relative">
             <select
                value={numberOfImages}
                onChange={(e) => onNumberOfImagesChange(parseInt(e.target.value, 10))}
                disabled={isDisabled}
                className="w-full sm:w-auto h-full appearance-none bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                aria-label="Số lượng ảnh"
             >
                {NUM_OPTIONS.map(num => <option key={num} value={num}>{num} ảnh</option>)}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
             </div>
           </div>
           <button
             type="submit"
             disabled={isDisabled || !prompt.trim()}
             className="w-full sm:w-auto px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
           >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7.5a1.5 1.5 0 01-1.5 1.5H6.5A1.5 1.5 0 015 12.5V5z" />
              <path d="M15 11a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
             <span>Tạo</span>
           </button>
         </form>
      </div>
    </div>
  );
};

export default GenerationOptions;