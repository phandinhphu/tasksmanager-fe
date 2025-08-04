import * as httpRequest from '../utils/httpRequest';

export const getRooms = async () => {
    try {
        const response = await httpRequest.get('/chat/me/rooms');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const createRoom = async (roomData) => {
    try {
        const response = await httpRequest.post('/chat/rooms', roomData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getRoom = async (roomId) => {
    try {
        const response = await httpRequest.get(`/chat/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const sendMessage = async (roomId, messageData) => {
    try {
        const response = await httpRequest.post(`/chat/rooms/${roomId}/messages`, messageData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};
