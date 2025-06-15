import * as httpRequest from '../utils/httpRequest';

export const getSchedulesByUserId = async () => {
    try {
        const response = await httpRequest.get('/schedules/me');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const createSchedule = async (schedule) => {
    try {
        const response = await httpRequest.post('/schedules/create', schedule);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const updateSchedule = async (scheduleId, updatedSchedule) => {
    try {
        const response = await httpRequest.put(`/schedules/${scheduleId}`, updatedSchedule);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const deleteSchedule = async (scheduleId) => {
    try {
        const response = await httpRequest.del(`/schedules/${scheduleId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};
