import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as scheduleServices from '../services/scheduleServices';

export const useSchedules = () => {
    return useQuery({
        queryKey: ['schedules'],
        queryFn: () => scheduleServices.getSchedulesByUserId(),
        enabled: true,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (schedule) => scheduleServices.createSchedule(schedule),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
        },
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (schedule) => scheduleServices.updateSchedule(schedule._id, schedule),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
        },
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (scheduleId) => scheduleServices.deleteSchedule(scheduleId),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
        },
    });
};
