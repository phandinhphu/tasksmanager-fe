import * as httpRequest from '../utils/httpRequest';

export const getAllTasks = async () => {
    try {
        const response = await httpRequest.get('/tasks');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getTasksByUserId = async () => {
    try {
        const response = await httpRequest.get('/tasks/me');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const createTask = async (task) => {
    try {
        const response = await httpRequest.post('/tasks', task);
        return response;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const updateTask = async (taskId, updatedTask) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}`, updatedTask);
        return response;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await httpRequest.del(`/tasks/${taskId}`);
        return response;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getStatusTask = async () => {
    try {
        const response = await httpRequest.get('/tasks/status');
        return response.data;
    } catch (error) {
        console.error('Error fetching status:', error);
        throw new Error('Error fetching status: ' + error.message);
    }
};

export const getPriorityTask = async () => {
    try {
        const response = await httpRequest.get('/tasks/priority');
        return response.data;
    } catch (error) {
        console.error('Error fetching priority:', error);
        throw new Error('Error fetching priority: ' + error.message);
    }
};

// Lấy thống kê task
export const getTaskStatistics = async () => {
    try {
        const response = await httpRequest.get('/tasks/stats');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

// Cập nhật trạng thái hoàn thành của task
export const updateTaskComplete = async (taskId) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}/complete`);
        return response;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

// Cập nhật trạng thái hoàn thành của subtask
export const updateSubTaskComplete = async (taskId, subTaskId) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}/subtasks/${subTaskId}/complete`);
        return response;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};
