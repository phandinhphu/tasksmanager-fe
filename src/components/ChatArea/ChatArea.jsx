import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/material/styles';
import ChatMessage from '../ChatMessage';
import PropTypes from 'prop-types';
import socket from '../../utils/socket';

const ChatAreaContainer = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(1, 2),
    overflowY: 'auto',
    backgroundColor: theme.palette.background.default,
    '&::-webkit-scrollbar': {
        width: 6,
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[400],
        borderRadius: 3,
        '&:hover': {
            backgroundColor: theme.palette.grey[500],
        },
    },
}));

const MessageInput = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2, 2, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const ChatArea = ({ selectedRoom, messages = [], onSendMessage, onReceiveMessage, currentUser }) => {
    console.log('selectedRoom:', selectedRoom);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedRoom && selectedRoom._id) {
            console.log('Joining room:', selectedRoom._id);
            socket.emit('joinRoom', selectedRoom._id);

            socket.on('receiveMessage', (message) => {
                console.log('New message received:', message);
                onReceiveMessage(message); // Update the chat with the new message
            });
        }

        return () => socket.off('receiveMessage');
    }, [selectedRoom, onSendMessage]);

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedRoom) {
            socket.emit('sendMessage', {
                roomId: selectedRoom._id,
                content: newMessage.trim(),
                sender: currentUser,
            });

            onSendMessage({
                roomId: selectedRoom._id,
                content: newMessage.trim(),
                sender: currentUser,
            });
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!selectedRoom) {
        return (
            <ChatAreaContainer>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'text.secondary',
                        p: 4,
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                        💬 Chọn một phòng chat
                    </Typography>
                    <Typography variant="body1">
                        Chọn một phòng chat từ danh sách bên trái để bắt đầu cuộc trò chuyện
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Hoặc tạo phòng chat mới bằng cách nhấn vào nút +
                    </Typography>
                </Box>
            </ChatAreaContainer>
        );
    }

    const otherParticipant = selectedRoom.members.find((p) => p._id !== currentUser?._id);

    return (
        <ChatAreaContainer>
            {/* Chat Header */}
            <ChatHeader>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedRoom.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {otherParticipant?.email} • {selectedRoom.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                </Typography>
            </ChatHeader>

            {/* Messages */}
            <MessagesContainer>
                {messages.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography variant="body1" gutterBottom>
                            🎉 Phòng chat mới được tạo!
                        </Typography>
                        <Typography variant="body2">Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện</Typography>
                    </Box>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message._id || index}
                                message={message.content}
                                timestamp={message.timestamp || new Date()}
                                isUser={message.senderId === currentUser?._id}
                                avatar={message.sender?.avatar}
                                userName={message.sender?.name}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </MessagesContainer>

            <Divider />

            {/* Message Input */}
            <MessageInput>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton size="small" disabled>
                                    <EmojiEmotionsIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" disabled sx={{ mr: 1 }}>
                                    <AttachFileIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    color="primary"
                                >
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </MessageInput>
        </ChatAreaContainer>
    );
};

ChatArea.propTypes = {
    selectedRoom: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string,
                email: PropTypes.string,
                avatar: PropTypes.string,
            }),
        ).isRequired,
        isOnline: PropTypes.bool,
    }),
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            content: PropTypes.string.isRequired,
            timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
            senderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            sender: PropTypes.shape({
                name: PropTypes.string,
                avatar: PropTypes.string,
            }),
        }),
    ),
    onSendMessage: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
};

export default ChatArea;
