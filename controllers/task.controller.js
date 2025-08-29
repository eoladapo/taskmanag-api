import Task from '../models/task.model.js';
import { buildQuery } from '../utils/query.js';
import { getTaskStats } from '../utils/taskStats.js';

export const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const newTask = await Task.create({ user: req.user.id, title, description, status });
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { query, sort } = buildQuery(req.query, req.user.id);
    const tasks = await Task.find(query).sort(sort);
    res.status(200).json({ message: 'Tasks retrieved successfully', count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task retrieved successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete({ _id: id, user: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const TaskStats = async (req, res) => {
  try {
    const stats = await getTaskStats(req.user.id);
    // console.log('stats', stats);
    res.status(200).json({ message: 'Task stats retrieved successfully', stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
