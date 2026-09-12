import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const extractEntities = async (rawText: string) => {
  // If no API key is provided yet, return a mock response for now
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is not set. Returning mock extracted entities.");
    return {
      skills: ["JavaScript", "React", "Node.js"],
      experienceYears: 3,
      education: "B.Tech in Computer Science",
      projects: ["E-commerce website", "Portfolio app"]
    };
  }

  const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash",
    maxOutputTokens: 2048,
  });

  const prompt = PromptTemplate.fromTemplate(`
    Extract the core entities from the following candidate resume text.
    Return ONLY a valid JSON object with the following structure:
    {{
      "skills": ["skill1", "skill2"],
      "experienceYears": 0,
      "education": "degree and university",
      "projects": ["project 1 description", "project 2 description"]
    }}
    
    Resume Text:
    {text}
  `);

  try {
    const chain = prompt.pipe(llm);
    const response = await chain.invoke({ text: rawText });
    
    let content = response.content as string;
    // Clean up potential markdown formatting from Gemini
    content = content.replace(/^```json/m, '').replace(/^```/m, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Entity Extraction failed:", error);
    throw new Error("Failed to extract entities using AI.");
  }
};
