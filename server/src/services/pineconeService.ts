import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
// Note: Requires PINECONE_API_KEY in .env
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || 'mock_key'
});

export const storeCandidateVector = async (candidateId: string, embedding: number[], metadata: any) => {
  if (process.env.PINECONE_API_KEY) {
    const index = pc.index('recruitment-index');
    await index.upsert([
      {
        id: candidateId,
        values: embedding,
        metadata: metadata
      }
    ]);
  } else {
    console.log(`[Mock] Vector stored for candidate: ${candidateId}`);
  }
};

export const searchTopCandidates = async (jdEmbedding: number[], topK: number = 20) => {
  if (process.env.PINECONE_API_KEY) {
    const index = pc.index('recruitment-index');
    const results = await index.query({
      topK,
      vector: jdEmbedding,
      includeMetadata: true
    });
    return results.matches;
  } else {
    console.log(`[Mock] Searched for top candidates.`);
    return [{ id: 'mock-1', score: 0.95 }, { id: 'mock-2', score: 0.88 }];
  }
};
