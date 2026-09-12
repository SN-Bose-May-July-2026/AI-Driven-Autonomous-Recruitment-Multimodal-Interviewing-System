import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const generateInterviewRubric = async (candidateData: any, jobDescription: string) => {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is not set. Returning mock rubric.");
    return [
      { question: "Can you explain your experience with React?", criteria: "Understanding of hooks and component lifecycle." },
      { question: "Tell me about a challenging project.", criteria: "Problem-solving skills and resilience." }
    ];
  }

  const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-pro", // Use a reasoning model for this
    maxOutputTokens: 2048,
  });

  const prompt = PromptTemplate.fromTemplate(`
    You are an expert AI Technical Interviewer.
    Your task is to generate a custom interview rubric for a candidate based on their profile and the Job Description.
    Identify gaps between the candidate's experience and the JD, and generate specific questions to test those gaps.
    Generate 5 targeted questions.
    
    Return ONLY a valid JSON array of objects with the structure:
    [{{ "question": "The question text", "criteria": "What to look for in a good answer" }}]
    
    Job Description:
    {jd}
    
    Candidate Data:
    {candidate}
  `);

  try {
    const chain = prompt.pipe(llm);
    const response = await chain.invoke({ 
      jd: jobDescription, 
      candidate: JSON.stringify(candidateData) 
    });
    
    let content = response.content as string;
    content = content.replace(/^```json/m, '').replace(/^```/m, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Rubric Generation failed:", error);
    throw new Error("Failed to generate rubric.");
  }
};
