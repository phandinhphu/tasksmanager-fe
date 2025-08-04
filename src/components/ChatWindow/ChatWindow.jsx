import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ChatIcon from '@mui/icons-material/Chat';
import RoomList from '../RoomList';
import ChatArea from '../ChatArea';
import PropTypes from 'prop-types';

const ChatContainer = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 800,
    height: 600,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: theme.shadows[8],
    zIndex: 1300,
}));

const ChatWindowHeader = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 56,
}));

const ChatContent = styled(Box)(() => ({
    display: 'flex',
    flex: 1,
    marginTop: 56,
    height: 'calc(100% - 56px)',
}));

const RoomListSection = styled(Box)(() => ({
    width: 300,
    borderRight: '1px solid',
    borderRightColor: 'divider',
}));

const ChatSection = styled(Box)(() => ({
    flex: 1,
}));

const ChatToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[6],
    zIndex: 1300,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
}));

const OnlineStatus = styled(Box)(({ theme, isOnline }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: '0.75rem',
        color: isOnline ? '#4caf50' : '#9e9e9e',
    },
}));

const ChatWindow = ({
    isOpen: controlledIsOpen,
    onToggle,
    rooms = [],
    messages = [],
    selectedRoom,
    onRoomSelect,
    onCreateRoom,
    onSendMessage,
    onReceiveMessage,
    currentUser,
    title = 'Chat Rooms',
    unreadCount = 0,
    onMinimize,
    onClose,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
        setIsMinimized(false);
    };

    const handleMinimize = () => {
        setIsMinimized(true);
        if (onMinimize) {
            onMinimize();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            setInternalIsOpen(false);
        }
        setIsMinimized(false);
    };

    if (!isOpen) {
        return (
            <Badge badgeContent={unreadCount} color="error">
                <ChatToggleButton onClick={handleToggle}>
                    <ChatIcon sx={{ fontSize: 28 }} />
                </ChatToggleButton>
            </Badge>
        );
    }

    if (isMinimized) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1300,
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <Paper
                        elevation={4}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            minWidth: 200,
                            background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
                            color: 'primary.contrastText',
                        }}
                        onClick={() => setIsMinimized(false)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatIcon />
                            <Typography variant="body2" sx={{ flex: 1 }}>
                                {title}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                                sx={{ color: 'inherit' }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Paper>
                </Badge>
            </Box>
        );
    }

    return (
        <ChatContainer elevation={8}>
            {/* Header */}
            <ChatWindowHeader>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={handleMinimize} sx={{ color: 'inherit' }}>
                        <MinimizeIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleClose} sx={{ color: 'inherit' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </ChatWindowHeader>

            {/* Chat Content */}
            <ChatContent>
                <RoomListSection>
                    <RoomList
                        rooms={rooms}
                        selectedRoom={selectedRoom}
                        onRoomSelect={onRoomSelect}
                        onCreateRoom={onCreateRoom}
                        currentUser={currentUser}
                    />
                </RoomListSection>

                <ChatSection>
                    <ChatArea
                        selectedRoom={selectedRoom}
                        messages={messages}
                        onSendMessage={onSendMessage}
                        onReceiveMessage={onReceiveMessage}
                        currentUser={currentUser}
                    />
                </ChatSection>
            </ChatContent>
        </ChatContainer>
    );
};

ChatWindow.propTypes = {
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    rooms: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            members: PropTypes.array.isRequired,
            lastMessage: PropTypes.object,
            unreadCount: PropTypes.number,
            isOnline: PropTypes.bool,
        }),
    ),
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            content: PropTypes.string,
            timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
            senderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            sender: PropTypes.object,
        }),
    ),
    selectedRoom: PropTypes.object,
    onRoomSelect: PropTypes.func,
    onCreateRoom: PropTypes.func,
    onSendMessage: PropTypes.func,
    currentUser: PropTypes.object,
    title: PropTypes.string,
    unreadCount: PropTypes.number,
    onMinimize: PropTypes.func,
    onClose: PropTypes.func,
};

export default ChatWindow;
