import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY môi trường biến không được thiết lập.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const describeImage = async (imageFile: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, {text: "Mô tả chi tiết hình ảnh này để một AI tạo hình ảnh khác có thể tái tạo lại nó một cách sáng tạo. Tập trung vào đối tượng chính, phong cách, màu sắc và bố cục."}] },
  });
  return response.text;
};

export const generateImageFromPrompt = async (prompt: string, aspectRatio: string, numberOfImages: number): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("AI không thể tạo hình ảnh từ lời nhắc này.");
    }
    
    return response.generatedImages.map(img => img.image.imageBytes);
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

      if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
      }
      
      throw new Error("Không thể tìm thấy hình ảnh đã chỉnh sửa trong phản hồi của AI.");
};