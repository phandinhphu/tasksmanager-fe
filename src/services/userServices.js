import * as httpRequest from '../utils/httpRequest';

export const updateUser = async (user) => {
    try {
        const response = await httpRequest.put('/user/me/update-profile', user);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const deleteAccount = async () => {
    try {
        const response = await httpRequest.del('/user/me/delete-account');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};
