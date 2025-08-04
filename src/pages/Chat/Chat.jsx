import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatWindow from '../../components/ChatWindow';
import SnackbarAlert from '../../components/SnackbarAlert';
import { useAuth } from '../../hooks/auth';
import { useChatRooms, useCreateChatRoom } from '../../hooks/chat';
import * as chatServices from '../../services/chatServices';
import * as userServices from '../../services/userServices';

const Chat = () => {
    const { user } = useAuth();
    const { data: chatRooms = [], isLoading: isChatRoomsLoading } = useChatRooms();
    const createChatRoom = useCreateChatRoom();

    const [isChatOpen, setIsChatOpen] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        setRooms(chatRooms);
    }, [chatRooms]);

    if (isChatRoomsLoading) {
        return <div>Loading...</div>;
    }

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    const handleMinimizeChat = () => {
        console.log('Chat minimized');
    };

    const handleRoomSelect = async (room) => {
        setSelectedRoom(room);

        const data = await chatServices.getRoom(room._id);
        console.log('Selected room messages:', messages);

        setMessages(
            data.messages.map((msg) => ({
                ...msg,
                senderId: msg.sender._id || user._id,
                avatar: msg.sender.avatar || user.avatar || '',
                username: msg.sender.name || user.name || 'User',
            })),
        );
    };

    const handleCreateRoom = async (roomData) => {
        console.log('Creating room with data:', roomData);

        try {
            const userExists = await userServices.checkUserExist(roomData.email);

            if (!userExists) {
                setResponse({
                    status: 'error',
                    message: 'Người dùng không tồn tại. Vui lòng kiểm tra lại email.',
                });
                setSnackbarOpen(true);

                return;
            }
        } catch (error) {
            console.error('Error checking user existence:', error);
            setResponse({
                status: 'error',
                message: 'Có lỗi xảy ra khi kiểm tra người dùng. Vui lòng thử lại.',
            });
            setSnackbarOpen(true);

            return;
        }

        const newRoom = {
            name: roomData.name || 'Phòng chat mới',
            email: roomData.email,
        };

        createChatRoom.mutate(newRoom, {
            onSuccess: (data) => {
                setRooms((prev) => [data, ...prev]);
                setSelectedRoom(data);
                setMessages([]);
            },

            onError: (error) => {
                console.error('Error creating chat room:', error);
                setResponse({
                    status: 'error',
                    message: 'Có lỗi xảy ra khi tạo phòng chat. Vui lòng thử lại.',
                });
                setSnackbarOpen(true);
            },
        });
    };

    const handleSendMessage = async (messageData) => {
        console.log('Sending message:', messageData);
        console.log('user:', user);
        const newMessage = {
            content: messageData.content,
            senderId: user._id,
            avatar: user.avatar || '',
            username: user.name || 'User',
        };

        try {
            const data = await chatServices.sendMessage(messageData.roomId, newMessage);
            console.log('Message sent successfully:', data);

            // Add message to current room
            setMessages((prev) => [
                ...prev,
                {
                    ...newMessage,
                    _id: data._id,
                    timestamp: data.createdAt || new Date(),
                },
            ]);

            // Update room last message
            setRooms((prev) =>
                prev.map((room) =>
                    room.id === messageData.roomId
                        ? { ...room, lastMessage: { content: data.content, timestamp: new Date() } }
                        : room,
                ),
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setResponse({
                status: 'error',
                message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
            });
            setSnackbarOpen(true);
        }
    };

    const handleReceiveMessage = (messageData) => {
        console.log('Received message:', messageData);
        if (selectedRoom && selectedRoom._id === messageData.roomId && user?._id !== messageData.senderId) {
            setMessages((prev) => [
                ...prev,
                {
                    _id: messageData._id || Date.now(),
                    content: messageData.content,
                    senderId: messageData.senderId,
                    avatar: messageData.avatar,
                    username: messageData.username,
                    timestamp: new Date(),
                },
            ]);
        }
    };

    // Calculate total unread count
    const totalUnreadCount = rooms.reduce((total, room) => total + (room.unreadCount || 0), 0);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                    }}
                >
                    Chat Rooms
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Tạo phòng chat và mời bạn bè tham gia thông qua email để cùng làm việc hiệu quả.
                </Typography>
            </Box>

            {/* Features Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: 'center',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <GroupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Chat Nhóm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tạo phòng chat để thảo luận dự án với đồng nghiệp và bạn bè.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: 'center',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <AccessTimeIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Thời Gian Thực
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tin nhắn được gửi và nhận ngay lập tức, không bỏ lỡ thông tin quan trọng.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            textAlign: 'center',
                            height: '100%',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <NotificationsActiveIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Thông Báo Thông Minh
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Nhận thông báo tin nhắn mới và không bỏ lỡ cuộc trò chuyện quan trọng.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Chat Interface Instructions */}
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                    textAlign: 'center',
                }}
            >
                <ChatIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    💬 Bắt Đầu Chat
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Nhấn vào biểu tượng chat ở góc dưới bên phải để mở cửa sổ chat. Tạo phòng mới hoặc chọn phòng có sẵn
                    để bắt đầu trò chuyện.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                    <Button variant="contained" startIcon={<ChatIcon />} onClick={handleToggleChat} size="large">
                        {isChatOpen ? 'Đóng Chat' : 'Mở Chat'}
                    </Button>
                </Stack>

                <Box sx={{ mt: 3, p: 2, borderRadius: 1, backgroundColor: 'background.paper' }}>
                    <Typography variant="body2" color="text.secondary">
                        📧 <strong>Mời thành viên:</strong> Nhập email trong dialog "Tạo phòng chat mới"
                    </Typography>
                </Box>
            </Paper>

            {/* Chat Window Component */}
            <ChatWindow
                isOpen={isChatOpen}
                onToggle={handleToggleChat}
                onClose={handleCloseChat}
                onMinimize={handleMinimizeChat}
                rooms={rooms}
                selectedRoom={selectedRoom}
                messages={messages}
                onRoomSelect={handleRoomSelect}
                onCreateRoom={handleCreateRoom}
                onSendMessage={handleSendMessage}
                onReceiveMessage={handleReceiveMessage}
                currentUser={user}
                title="Chat Rooms"
                unreadCount={totalUnreadCount}
            />

            {/* Snackbar for alerts */}
            {response && (
                <SnackbarAlert snackbarOpen={snackbarOpen} onClose={() => setSnackbarOpen(false)} response={response} />
            )}
        </Container>
    );
};

export default Chat;
