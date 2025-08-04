import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const MessagePaper = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(1.5, 2),
    maxWidth: '70%',
    borderRadius: 16,
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    borderBottomRightRadius: isUser ? 4 : 16,
    borderBottomLeftRadius: isUser ? 16 : 4,
    boxShadow: theme.shadows[2],
}));

const MessageContainer = styled(Box)(({ isUser }) => ({
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
    flexDirection: isUser ? 'row-reverse' : 'row',
}));

const ChatMessage = ({ message, timestamp, isUser = false, avatar, userName }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <MessageContainer isUser={isUser}>
            <Avatar
                src={avatar}
                sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                }}
            >
                {!avatar && (userName ? userName.charAt(0).toUpperCase() : '?')}
            </Avatar>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                {!isUser && userName && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, px: 1 }}>
                        {userName}
                    </Typography>
                )}

                <MessagePaper isUser={isUser} elevation={2}>
                    <Typography
                        variant="body2"
                        sx={{
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                    >
                        {message}
                    </Typography>
                </MessagePaper>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                        px: 1,
                        fontSize: '0.75rem',
                    }}
                >
                    {formatTime(timestamp)}
                </Typography>
            </Box>
        </MessageContainer>
    );
};

ChatMessage.propTypes = {
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
    isUser: PropTypes.bool,
    avatar: PropTypes.string,
    userName: PropTypes.string,
};

export default ChatMessage;
