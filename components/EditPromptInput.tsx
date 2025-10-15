
import React, { useState } from 'react';

interface EditPromptInputProps {
  onEdit: (prompt: string) => void;
  isDisabled: boolean;
}

const EditPromptInput: React.FC<EditPromptInputProps> = ({ onEdit, isDisabled }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim() && !isDisabled) {
      onEdit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="w-full bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-4">
      <div>
        <h3 className="text-md font-semibold text-gray-300 mb-3 text-center">Chỉnh sửa ảnh đã tạo</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
          <label htmlFor="edit-prompt" className="sr-only">Yêu cầu sửa hình ảnh</label>
          <input
            id="edit-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: thêm một chiếc mũ cho nhân vật"
            className="w-full flex-grow bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            disabled={isDisabled}
          />
          <button
            type="submit"
            disabled={isDisabled || !prompt.trim()}
            className="w-full sm:w-auto px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            <span>Sửa ảnh</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPromptInput;