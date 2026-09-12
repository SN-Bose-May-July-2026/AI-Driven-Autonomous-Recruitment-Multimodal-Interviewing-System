import { Queue, Worker } from 'BullMQ';
import IORedis from 'ioredis';
import { extractEntities } from '../services/aiService';
import { PrismaClient } from '@prisma/client';

// Mock Redis connection (assumes local Redis for dev)
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const prisma = new PrismaClient();

// Create a queue for processing resumes
export const resumeQueue = new Queue('ResumeProcessingQueue', { connection });

// Create a worker to process the jobs
const resumeWorker = new Worker('ResumeProcessingQueue', async (job) => {
  console.log(`Processing job ${job.id}: Candidate ${job.data.candidateName}`);
  
  const { resumeText, jobId, candidateId } = job.data;
  
  try {
    // 1. LLM Extraction
    const structuredData = await extractEntities(resumeText);
    
    // 2. Vector DB Insertion & Similarity Scoring (Mocked for now)
    const similarityScore = Math.random() * 100; // Mock score

    // 3. Update PostgreSQL database
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
