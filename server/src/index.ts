import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import uploadRoutes from './routes/upload';
import interviewRoutes from './routes/interview';

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
  socket.on('candidate_audio_transcript', (data) => {
    console.log(`Transcript from ${socket.id}:`, data);
    // TODO: Send to LLM Agent and stream response back
    
    // Echo back for now
    socket.emit('agent_response_text', { text: `Agent heard: ${data.text}` });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
