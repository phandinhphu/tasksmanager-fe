import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Fade,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardTask from '../../../components/CardTask';
import DialogConfirm from '../../../components/DialogConfirm';
import EditTaskDialog from '../../../components/EditTaskDialog';

const TaskCardWrapper = ({ task, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleEdit = () => {
        setEditOpen(true);
        handleCloseMenu();
    };

    const handleDelete = () => {
        handleCloseMenu();
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(task);
        setConfirmOpen(false);
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minWidth: 300,
                maxWidth: 400,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                },
            }}
        >
            {/* Button menu ở góc phải */}
            <IconButton onClick={handleOpenMenu} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} TransitionComponent={Fade}>
                {task.completed ? null : (
                    <MenuItem onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Sửa
                    </MenuItem>
                )}
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xoá
                </MenuItem>
            </Menu>

            {/* Hộp thoại xác nhận xoá */}
            {confirmOpen && (
                <DialogConfirm
                    openDialog={confirmOpen}
                    onClose={handleCancelDelete}
                    onDelete={handleConfirmDelete}
                    text={`Bạn có chắc chắn muốn xóa công việc "${task.task_name}"?`}
                />
            )}

            {/* Card task nguyên bản */}
            <CardTask task={task} />

            {/* Hộp thoại sửa task */}
            {editOpen && (
                <EditTaskDialog open={editOpen} onClose={() => setEditOpen(false)} task={task} onSave={onEdit} />
            )}
        </Box>
    );
};

export default TaskCardWrapper;
