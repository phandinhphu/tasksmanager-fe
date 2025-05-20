// src/services/api.js
import * as httpRequest from '../utils/httpRequest';

export const getAllTasks = async () => {
  try {
    const response = await httpRequest.get('/tasks');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching tasks: ' + error.message);
  }
};

export const getTasksByUserId = async (userId) => {
  try {
    const response = await getAllTasks();
    return response.filter(task => task.userid === userId);
  } catch (error) {
    throw new Error('Error fetching tasks by user ID: ' + error.message);
  }
};

export const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await httpRequest.put(`/tasks/${taskId}`, updatedTask);
    return response;
  } catch (error) {
    throw new Error('Error updating task: ' + error.message);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const task = await getTaskById(taskId);
    if (task.subtasks && task.subtasks.length > 0) {
      await Promise.all(task.subtasks.map(async subtask => {
        await createTask({
          ...subtask,
          subtasks: [],
          userid: task.userid,
          created_at: subtask.created_at || new Date().toISOString(),
          updated_at: subtask.updated_at || new Date().toISOString(),
        });
      }));
    }
    const response = await httpRequest.del(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    throw new Error('Error deleting task: ' + error.message);
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await httpRequest.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching task by ID: ' + error.message);
  }
};

export const createTask = async (task) => {
  try {
    const response = await httpRequest.post('/tasks', task);
    return response;
  } catch (error) {
    throw new Error('Error creating task: ' + error.message);
  }
};

export const getStatusTask = async () => {
  return [
    { id: 1, name: 'To Do' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Completed' }
  ];
};

export const getPriorityTask = async () => {
  return [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' }
  ];
};

export const getSchedules = async (userId) => {
  try {
    const response = await httpRequest.get('/schedules');
    return response.data.filter(schedule => schedule.userid === userId);
  } catch (error) {
    throw new Error('Error fetching schedules: ' + error.message);
  }
};

export const updateSchedule = async (id, data) => {
  try {
    const response = await httpRequest.put(`/schedules/${id}`, data);
    return response;
  } catch (error) {
    throw new Error('Error updating schedule: ' + error.message);
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await httpRequest.del(`/schedules/${id}`);
    return response;
  } catch (error) {
    throw new Error('Error deleting schedule: ' + error.message);
  }
};

export const getUserProfile = async (id) => {
  try {
    const response = await httpRequest.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

export const updateUserProfile = async (id, data) => {
  try {
    const response = await httpRequest.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error updating user profile: ' + error.message);
  }
};