import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateBookTeaser = async (
  title: string,
  rawDescription: string,
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      You are a curator for a "Blind Date with a Book" shop. 
      I will give you a book description. Write a mysterious, cozy, and tantalizing 1-sentence teaser (max 15 words) for it. 
      Do NOT mention the book's title or character names. Make it sound like an aesthetic trope or vibe.
      
      Book Description: ${rawDescription}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().replace(/["']/g, "").trim();
  } catch (error) {
    console.error("AI Teaser failed:", error);
    return "A beautiful and mysterious narrative awaits...";
  }
};
