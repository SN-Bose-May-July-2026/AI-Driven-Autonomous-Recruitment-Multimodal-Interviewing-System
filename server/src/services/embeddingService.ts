import crypto from 'crypto';

const DEFAULT_DIM = Number(process.env.EMBEDDING_DIM) || 1536;

/**
 * Deterministic mock embedding: hash the chunk text and expand into floats.
 * This is useful for local dev so the vector pipeline works even without an API key.
 * Replace embedText with a real embedding provider call.
 */
function mockEmbedding(text: string, dim: number = DEFAULT_DIM): number[] {
  const hash = crypto.createHash('sha256').update(text).digest();
  const values: number[] = new Array(dim);
  for (let i = 0; i < dim; i++) {
    const b = hash[i % hash.length];
    values[i] = ((b / 255) * 2) - 1;
  }
  return values;
}

/**
 * embedText: given a text chunk, produce a numeric embedding vector.
 * - If EMBEDDING_PROVIDER is set and credentials exist, call the provider (TODO)
 * - Otherwise return a mock embedding.
 */
export async function embedText(
  text: string,
  dim: number = DEFAULT_DIM
): Promise<number[]> {
  if (process.env.EMBEDDING_PROVIDER === 'real') {
    // TODO: integrate a real embedding provider here (Gemini embeddings or OpenAI)
    console.warn('EMBEDDING_PROVIDER=real selected but no provider integration is implemented. Falling back to mock.');
  }

  return mockEmbedding(text, dim);
}

/**
 * embedMany: embed an array of chunks (preserves order).
 */
export async function embedMany(
  chunks: string[],
  dim: number = DEFAULT_DIM
): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const chunk of chunks) {
    const emb = await embedText(chunk, dim);
    embeddings.push(emb);
  }
  return embeddings;
}
