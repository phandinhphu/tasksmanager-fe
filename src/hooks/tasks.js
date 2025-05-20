// src/hooks/tasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksByUserId, deleteTask } from '../services/taskServices';

export const useTasks = (userId) => {
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => getTasksByUserId(userId),
    enabled: !!userId,
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
};