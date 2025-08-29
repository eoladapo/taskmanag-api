import express from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  TaskStats,
  updateTask,
} from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/stats', TaskStats);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export { router as taskRouter };
