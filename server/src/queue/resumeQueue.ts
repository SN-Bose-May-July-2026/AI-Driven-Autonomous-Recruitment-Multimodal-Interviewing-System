import { Queue, Worker } from 'BullMQ';
import IORedis from 'ioredis';
import { extractEntities } from '../services/aiService';
import { PrismaClient } from '@prisma/client';
import { chunkText } from '../services/textSplitter';
import { embedMany } from '../services/embeddingService';
import { storeCandidateVector } from '../services/pineconeService';

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
});

const prisma = new PrismaClient();

export const resumeQueue = new Queue('ResumeProcessingQueue', { connection });

const resumeWorker = new Worker('ResumeProcessingQueue', async (job) => {
  console.log(`Processing job ${job.id}: Candidate ${job.data.candidateName}`);

  const { resumeText, jobId, candidateId } = job.data;

  try {
    // 1. LLM Extraction
    const structuredData = await extractEntities(resumeText);

    // 2. Chunking (LangChain RecursiveCharacterTextSplitter)
    const chunkSize = Number(process.env.CHUNK_SIZE || 500);
    const chunkOverlap = Number(process.env.CHUNK_OVERLAP || 50);
    const chunks = await chunkText(resumeText, chunkSize, chunkOverlap);

    // 3. Embeddings
    const embeddings = await embedMany(chunks);

    // 4. Upsert each chunk into Pinecone with metadata
    for (let i = 0; i < chunks.length; i++) {
      const embedding = embeddings[i];
      const snippet = chunks[i].slice(0, 800);
      const vectorId = `${candidateId}::${i}`;

      await storeCandidateVector(vectorId, embedding, {
        candidateId,
        chunkIndex: i,
        snippet,
      });
    }

    // 5. Mock similarity score (to be computed against JD embedding in a separate step)
    const similarityScore = Math.random() * 100;

    // 6. Update PostgreSQL
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        structuredData,
        similarityScore,
        status: 'Processed'
      }
    });

    console.log(`Job ${job.id} completed successfully.`);
  } catch (err) {
    console.error(`Job ${job.id} failed:`, err);
    throw err;
  }
}, { connection });

resumeWorker.on('completed', (job) => {
  console.log(`Worker: Job ${job.id} has completed!`);
});

resumeWorker.on('failed', (job, err) => {
  console.log(`Worker: Job ${job?.id} has failed with ${err.message}`);
});
