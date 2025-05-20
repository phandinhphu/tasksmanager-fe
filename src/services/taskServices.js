// src/services/taskServices.js
import * as httpRequest from '../utils/httpRequest';

export const getTasksByUserId = async (userId) => {
  try {
    const response = await httpRequest.get('/tasks');
    return response.data.filter(task => task.userid === userId);
  } catch (error) {
    throw new Error('Error fetching tasks by user ID: ' + error.message);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await httpRequest.del(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting task: ' + error.message);
  }
};