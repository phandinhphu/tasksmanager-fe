import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const RoomListContainer = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
}));

const RoomListHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const RoomList = styled(List)(() => ({
    flex: 1,
    overflow: 'auto',
    padding: 0,
}));

const RoomListComponent = ({ rooms = [], selectedRoom, onRoomSelect, onCreateRoom, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [newRoomEmail, setNewRoomEmail] = useState('');
    const [newRoomName, setNewRoomName] = useState('');

    const filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateRoom = () => {
        if (newRoomEmail && newRoomName) {
            onCreateRoom({
                name: newRoomName,
                email: newRoomEmail,
            });
            setNewRoomEmail('');
            setNewRoomName('');
            setCreateRoomOpen(false);
        }
    };

    const formatLastMessage = (room) => {
        if (!room.lastMessage) return 'Chưa có tin nhắn';
        const maxLength = 30;
        const message = room.lastMessage.content;
        return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffHours = Math.abs(now - messageTime) / 36e5;

        if (diffHours < 24) {
            return messageTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            return messageTime.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
            });
        }
    };

    return (
        <RoomListContainer>
            <RoomListHeader>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tin nhắn
                </Typography>
                <IconButton size="small" onClick={() => setCreateRoomOpen(true)} sx={{ color: 'primary.main' }}>
                    <AddIcon />
                </IconButton>
            </RoomListHeader>

            <SearchContainer>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm phòng chat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                />
            </SearchContainer>

            <RoomList>
                {filteredRooms.map((room) => {
                    const otherParticipant = room.members.find((p) => p._id !== currentUser?._id);
                    const isSelected = selectedRoom?._id === room._id;

                    return (
                        <ListItem key={room._id} disablePadding>
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => onRoomSelect(room)}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.50',
                                        borderRight: 3,
                                        borderRightColor: 'primary.main',
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        badgeContent={room.unreadCount || 0}
                                        color="error"
                                        invisible={!room.unreadCount}
                                    >
                                        <Avatar src={otherParticipant?.avatar}>
                                            {otherParticipant?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: room.unreadCount ? 600 : 400,
                                                    flex: 1,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {room.name}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flex: 1,
                                                }}
                                            >
                                                {formatLastMessage(room)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Thành viên: {room.members.length}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}

                {filteredRooms.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">
                            {searchTerm ? 'Không tìm thấy phòng chat nào' : 'Chưa có phòng chat nào'}
                        </Typography>
                        <Typography variant="caption">Nhấn + để tạo phòng chat mới</Typography>
                    </Box>
                )}
            </RoomList>

            {/* Create Room Dialog */}
            <Dialog open={createRoomOpen} onClose={() => setCreateRoomOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo phòng chat mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên phòng chat"
                        fullWidth
                        variant="outlined"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Email người tham gia"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newRoomEmail}
                        onChange={(e) => setNewRoomEmail(e.target.value)}
                        helperText="Nhập email của người bạn muốn mời vào phòng chat"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateRoomOpen(false)}>Hủy</Button>
                    <Button onClick={handleCreateRoom} variant="contained" disabled={!newRoomEmail || !newRoomName}>
                        Tạo phòng
                    </Button>
                </DialogActions>
            </Dialog>
        </RoomListContainer>
    );
};

RoomListComponent.propTypes = {
    rooms: PropTypes.arrayOf(
        PropTypes.shape({
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
        }),
    ),
    selectedRoom: PropTypes.object,
    onRoomSelect: PropTypes.func.isRequired,
    onCreateRoom: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
};

export default RoomListComponent;
