
import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeRoles = async (count: number): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `초등학교 교실 청소를 더 즐겁게 하기 위해, ${count}개의 창의적이고 재미있는 청소 역할 이름을 만들어줘. 예를 들어 '먼지 사냥꾼', '유리창 마술사' 같은 느낌으로.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    // Handle potential undefined text property from GenerateContentResponse
    const text = response.text;
    const roles = text ? JSON.parse(text) : [];
    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error("Gemini Role Generation Error:", error);
    return ["먼지 사냥꾼", "반짝이 요정", "정리 왕", "빗자루 전사", "물걸레 마스터"];
  }
};

export const getCleaningTip = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "초등학생들이 즐겁게 교실 청소를 할 수 있는 짧은 격려 문구나 꿀팁 한 줄을 작성해줘.",
        });
        // Handle potential undefined text property and avoid calling trim on undefined
        return response.text?.trim() || "깨끗한 교실에서 공부하면 마음도 반짝반짝 빛나요!";
    } catch (error) {
        return "깨끗한 교실에서 공부하면 마음도 반짝반짝 빛나요!";
    }
}
