import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import blockRoutes from './routes/blockRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import shareRoutes from './routes/shareRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', shareRoutes);

app.use('/api/documents', documentRoutes); 
app.use('/api/documents/:documentId/blocks', blockRoutes); 

app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use(notFound);
app.use(errorHandler);


export default app;