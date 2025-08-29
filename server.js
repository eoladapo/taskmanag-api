import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes/task.routes.js';
import connectDB from './config/database.js';
import { userRouter } from './routes/user.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());

connectDB();

app.use('/api/tasks', taskRouter);
app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});

export default app;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on post ${process.env.PORT}...`);
});
