import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**
 * chunkText - uses LangChain's RecursiveCharacterTextSplitter to split text into chunks.
 * Returns an array of string chunks (pageContent).
 */
export async function chunkText(
  text: string,
  chunkSize: number = Number(process.env.CHUNK_SIZE || 500),
  chunkOverlap: number = Number(process.env.CHUNK_OVERLAP || 50)
): Promise<string[]> {
  if (!text) return [];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  // createDocuments accepts an array of strings and returns Documents with pageContent
  const docs = await splitter.createDocuments([text]);
  return docs.map((d) => d.pageContent);
}
