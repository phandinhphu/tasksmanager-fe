import axios from 'axios';

const TaskManagerRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Fallback to localhost,
    timeout: 10000, // Request timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const get = async (url, params = {}) => {
    const response = await TaskManagerRequest.get(url, params);
    return response;
};

export const post = async (url, data = {}) => {
    const response = await TaskManagerRequest.post(url, data);
    return response;
}

export const put = async (url, data = {}) => {
    const response = await TaskManagerRequest.put(url, data);
    return response;
}

export const del = async (url) => {
    const response = await TaskManagerRequest.delete(url);
    return response;
}

export default TaskManagerRequest;
