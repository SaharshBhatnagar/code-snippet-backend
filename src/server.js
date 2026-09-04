import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import snippetRoutes from './routes/snippetRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api/snippets', snippetRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Server is working');
});

connectDB(); 

app.listen(PORT, () => {
    console.log(`Server is listning on port: ${PORT}...`);
});