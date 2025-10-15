import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import EditPromptInput from './components/EditPromptInput';
import GenerationOptions from './components/GenerationOptions';
import { describeImage, generateImageFromPrompt, editImage } from './services/geminiService';

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!src) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="Xem ảnh lớn" className="object-contain w-auto h-auto max-w-full max-h-full rounded-lg" />
      </div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
        aria-label="Đóng"
      >
        &times;
      </button>
    </div>
  );
};


const App: React.FC = () => {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setTextPrompt(''); // Xóa câu lệnh văn bản khi chọn ảnh
    setReferenceImage(file);
    const previewUrl = URL.createObjectURL(file);
    setReferenceImagePreview(previewUrl);
    setGeneratedImages(null);
    setError(null);
    setIsLoading(true);

    try {
      setLoadingMessage('Đang phân tích hình ảnh tham chiếu...');
      const description = await describeImage(file);
      
      setLoadingMessage('Đang tạo thumbnail mới (có thể mất một chút thời gian)...');
      const newImageBase64s = await generateImageFromPrompt(
        `Tạo một thumbnail chất lượng cao, hấp dẫn với tỷ lệ ${aspectRatio}, dựa trên mô tả sau: ${description}`,
        aspectRatio,
        1
      );
      
      setGeneratedImages(newImageBase64s.map(img => `data:image/jpeg;base64,${img}`));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [aspectRatio]);

  const handleGenerateFromPrompt = useCallback(async () => {
    if (!textPrompt.trim()) return;

    // Đặt lại trạng thái ảnh tham chiếu
    setReferenceImage(null);
    setReferenceImagePreview(null);
    setGeneratedImages(null);
    setError(null);
    setIsLoading(true);

    try {
      setLoadingMessage(`Đang tạo ${numberOfImages} thumbnail từ lời nhắc...`);
      const newImageBase64s = await generateImageFromPrompt(
        textPrompt,
        aspectRatio,
        numberOfImages
      );
      setGeneratedImages(newImageBase64s.map(img => `data:image/jpeg;base64,${img}`));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [textPrompt, aspectRatio, numberOfImages]);

  const handleEditImage = useCallback(async (prompt: string) => {
    if (!generatedImages || generatedImages.length === 0) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Đang áp dụng các thay đổi chỉnh sửa...');

    try {
      const dataUrl = generatedImages[0];
      const mimeTypeMatch = dataUrl.match(/data:(.*);base64,/);
      if (!mimeTypeMatch) {
          throw new Error('Không thể xác định loại MIME của hình ảnh.');
      }
      const mimeType = mimeTypeMatch[1];
      const base64Data = dataUrl.split(',')[1];
      
      const editedImageBase64 = await editImage(base64Data, mimeType, prompt);
      setGeneratedImages([`data:image/png;base64,${editedImageBase64}`]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Không thể chỉnh sửa hình ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [generatedImages]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Trình tạo và Chỉnh sửa Thumbnail AI
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Tạo thumbnail từ ảnh tham chiếu hoặc từ ý tưởng của bạn, sau đó tinh chỉnh bằng AI.
        </p>
        <div className="text-sm text-gray-500 mt-4 leading-relaxed">
          <p>PHẦN MỀM AI DO BÁ HỒNG MEDIA TẠO chia sẻ anh em miễn phí, anh em có thể ủng hộ một cốc caffe để phát triển thêm app chia sẻ anh em.</p>
          <div className="mt-2 inline-block text-left bg-gray-800/50 p-3 rounded-lg">
            <p className="font-semibold text-gray-400">Ngân Hàng Vietinbank</p>
            <p><span className="font-medium">Số tài khoản:</span> 0941182308</p>
            <p><span className="font-medium">Chủ tài khoản:</span> Nguyễn Bá Hồng</p>
          </div>
        </div>
      </header>
      
      {error && (
        <div className="w-full max-w-5xl bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <main className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center text-gray-300">BẢNG ĐIỀU KHIỂN</h2>
          <ImageUploader onImageSelect={handleImageSelect} preview={referenceImagePreview} />
          <GenerationOptions 
            selectedRatio={aspectRatio} 
            onChange={setAspectRatio} 
            isDisabled={isLoading}
            prompt={textPrompt}
            onPromptChange={setTextPrompt}
            onGenerateFromPrompt={handleGenerateFromPrompt}
            numberOfImages={numberOfImages}
            onNumberOfImagesChange={setNumberOfImages}
          />
          <EditPromptInput onEdit={handleEditImage} isDisabled={!generatedImages || generatedImages.length !== 1 || isLoading} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center text-gray-300">ẢNH THUMBNAIL ĐƯỢC TẠO</h2>
          <GeneratedImage images={generatedImages} isLoading={isLoading} loadingMessage={loadingMessage} onImageClick={setSelectedImage} />
        </div>
      </main>

      <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default App;