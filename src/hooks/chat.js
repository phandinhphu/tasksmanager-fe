import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatServices from '../services/chatServices';

export const useChatRooms = () => {
    return useQuery({
        queryKey: ['chatRooms'],
        queryFn: chatServices.getRooms,
        enabled: true,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useCreateChatRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomData) => chatServices.createRoom(roomData),
        onSuccess: () => {
            queryClient.invalidateQueries(['chatRooms']);
        },
    });
};

export const useChatRoom = (roomId) => {
    return useQuery({
        queryKey: ['chatRoom', roomId],
        queryFn: () => chatServices.getRoom(roomId),
        enabled: !!roomId,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: chatServices.sendMessage,
        onSuccess: () => {
            queryClient.invalidateQueries(['chatRooms']);
        },
    });
};
