// backend/src/index.js
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import taskRoutes from './routes/tasks.js';
import offerRoutes from './routes/offers.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';
import paymentRoutes from './routes/payments.js';
import uploadRoutes from './routes/uploads.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/skillsapp';

app.use(cors()); // allow all origins for dev
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    db: states[mongoose.connection.readyState] || mongoose.connection.readyState,
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join user to their personal room
  socket.join(`user:${socket.userId}`);
  
  // Join conversation rooms
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });
  
  // Leave conversation rooms
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });
  
  // Handle new messages
  socket.on('new-message', (data) => {
    // Broadcast to conversation room
    socket.to(`conversation:${data.conversationId}`).emit('message-received', data);
    
    // Notify other user if they're online
    data.recipients.forEach(recipientId => {
      if (recipientId !== socket.userId) {
        socket.to(`user:${recipientId}`).emit('new-message-notification', {
          conversationId: data.conversationId,
          message: data.message,
          sender: data.sender
        });
      }
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Make io available to other modules
app.set('io', io);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`✅ API http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();