import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import uploadRoutes from './routes/upload';
import interviewRoutes from './routes/interview';
import { getAgentResponse } from './services/agentService';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development, allow all
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/interview', interviewRoutes);

// WebSocket for real-time multimodal interview
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle incoming audio transcript from STT
  socket.on('candidate_audio_transcript', async (data) => {
    try {
      console.log(`Transcript from ${socket.id}:`, data);
      const transcript = data.text || '';

      // Optionally: run retrieval to get context and pass to agent
      // For now call agentService directly
      const result = await getAgentResponse(transcript, null);

      socket.emit('agent_response_text', { text: result.text });
    } catch (err) {
      console.error('Error handling transcript -> agent:', err);
      socket.emit('agent_response_text', { text: 'Agent error: unable to respond.'});
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
