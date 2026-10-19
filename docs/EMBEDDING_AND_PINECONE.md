# Embedding, chunking, and Pinecone index notes

This project now implements:

- LangChain RecursiveCharacterTextSplitter for chunking (server/src/services/textSplitter.ts)
- An embedding service with a deterministic mock fallback (server/src/services/embeddingService.ts)
- Per-chunk upsert into Pinecone from the resume worker (server/src/queue/resumeQueue.ts)

How to create the Pinecone index (recommended)

1. Create an index in the Pinecone console named `recruitment-index` (or set PINECONE_INDEX to your name).
2. Choose the metric: cosine is a common choice. Set dimension to match your embedding model (e.g., 1536 for many embeddings).
3. If using namespaces, you can switch the upsert/search calls to use them (the current code uses flat ids like candidateId::chunkIndex).

Embedding provider

- By default the repo uses a deterministic mock embedding for local development (no API keys required).
- To use real embeddings, implement embedText(...) in server/src/services/embeddingService.ts:
  - Option A: Gemini embeddings (via Google Generative AI SDK) — ensure GOOGLE_API_KEY and the embedding model name are configured and update embedText() accordingly.
  - Option B: OpenAI embeddings — if you prefer OpenAI, add OpenAI client usage and set OPENAI_API_KEY.

Retrieval & RAG

- The current flow stores per-chunk embeddings with metadata { candidateId, chunkIndex, snippet }.
- For RAG, implement a retrieval function that:
  1. creates an embedding for the query (job description or prompt),
  2. queries Pinecone (topK),
  3. assembles the top snippets into the prompt context,
  4. calls the LLM (Gemini) with that context.

If you want, I can update the embeddingService to call a specific provider (Gemini or OpenAI) and adjust the Pinecone index creation scripts accordingly.
