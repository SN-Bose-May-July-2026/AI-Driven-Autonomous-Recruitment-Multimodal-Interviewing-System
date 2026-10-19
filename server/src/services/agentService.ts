import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

export async function getAgentResponse(transcript: string, context: string | null = null) {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      text: `Agent (mock) received: ${transcript.slice(0, 200)}${transcript.length > 200 ? '...' : ''}`
    };
  }

  const llm = new ChatGoogleGenerativeAI({
    modelName: process.env.GENERATIVE_MODEL || 'gemini-1.5-flash',
    maxOutputTokens: 512,
  });

  const template = `
You are an interviewer assistant. Use the following context to respond helpfully and concisely.

Context:
{context}

Candidate transcript:
{transcript}

Respond as the interviewer/agent. Keep responses short and actionable.
`;

  const prompt = PromptTemplate.fromTemplate(template);

  try {
    const chain = prompt.pipe(llm);
    const resp = await chain.invoke({
      context: context ?? 'No additional context provided.',
      transcript,
    });
    const content = (resp.content ?? '') as string;
    return { text: content.trim() };
  } catch (err) {
    console.error('Agent LLM call failed:', err);
    return { text: 'Agent error: unable to generate response at the moment.' };
  }
}
