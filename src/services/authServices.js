import * as httpRequest from '../utils/httpRequest';

export const login = async (email, password) => {
    try {
        await httpRequest.post('/auth/login', { email, password });
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const register = async (user) => {
    try {
        const response = await httpRequest.post('/auth/register', user);
        return response.data;
    } catch (error) {
        console.error('Error in register:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const logout = async () => {
    try {
        await httpRequest.post('/auth/logout');
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await httpRequest.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await httpRequest.post('/auth/reset-password', { token, newPassword });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await httpRequest.get('/user/me');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};
