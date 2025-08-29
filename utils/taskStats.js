import mongoose from 'mongoose';
import Task from '../models/task.model.js';

export const getTaskStats = async (userId) => {
  // 1. Count of tasks by status
  const stats = await Task.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: { _id: '$status', count: { $sum: 1 } },
    },
  ]);

  const statusFormatted = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const total = Object.values(statusFormatted).reduce((a, b) => a + b, 0);
  const completed = statusFormatted['completed'] || 0;

  // 2. Monthly task creation trend for the past 6 months
  const monthlyStats = await Task.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 },
    },
  ]);

  const monthlyFormatted = monthlyStats.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    count: item.count,
  }));

  // 3. Calculate completion rate
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

  // 4. Average tasks created per day
  const dayStats = await Task.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTasksPerDay = dayStats.length > 0 ? (total / dayStats.length).toFixed(2) : 0;

  return {
    total,
    pending: statusFormatted['pending'] || 0,
    inProgress: statusFormatted['in-progress'] || 0,
    completed,
    completionRate: `${completionRate}%`,
    averageTasksPerDay: avgTasksPerDay,
    monthlyStats: monthlyFormatted,
  };
};
