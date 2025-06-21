import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Grid,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CardContent,
    IconButton,
    Pagination,
    InputLabel,
    FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SnackbarAlert from '../../components/SnackbarAlert';
import DialogConfirm from '../../components/DialogConfirm';
import { useSchedules, useUpdateSchedule, useDeleteSchedule } from '../../hooks/schedules';
import EditScheduleDialog from '../../components/EditScheduleDialog';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Schedules = () => {
    const { data: schedules = [], isLoading, isFetching } = useSchedules();
    const updateSchedule = useUpdateSchedule();
    const deleteSchedule = useDeleteSchedule();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
    const [response, setResponse] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDay, setFilterDay] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 6;

    if (isLoading || isFetching) {
        return (
            <Typography variant="h6" sx={{ m: 2 }}>
                Đang tải lịch học...
            </Typography>
        );
    }

    const filteredSchedules = schedules.filter(
        (sch) =>
            sch.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterDay ? sch.days.includes(filterDay) : true),
    );

    const paginatedSchedules = filteredSchedules.slice((page - 1) * pageSize, page * pageSize);

    const onEdit = (schedule) => {
        // Handle edit action
        setSelectedSchedule(schedule);
        setOpenEditDialog(true);
    };

    const onDelete = (schedule) => {
        // Handle delete action
        setSelectedSchedule(schedule);
        setDeleteOpenDialog(true);
    };

    const handleEdit = (updatedSchedule) => {
        setResponse({});
        setSnackbarOpen(false);

        // Handle save action
        updateSchedule.mutate(updatedSchedule, {
            onSuccess: () => {
                setOpenEditDialog(false);
                setSelectedSchedule(null);
                setResponse({ status: 'success', message: 'Cập nhật lịch học thành công!' });
                setSnackbarOpen(true);
            },
            onError: (error) => {
                setResponse({ status: 'error', message: 'Cập nhật lịch học thất bại!' });
                setSnackbarOpen(true);
            },
        });
    };

    const handleDelete = (schedule) => {
        setResponse({});
        setSnackbarOpen(false);

        // Handle delete action
        deleteSchedule.mutate(schedule._id, {
            onSuccess: () => {
                setDeleteOpenDialog(false);
                setSelectedSchedule(null);
                setResponse({ status: 'success', message: 'Xoá lịch học thành công!' });
                setSnackbarOpen(true);
            },
            onError: (error) => {
                console.error('Error deleting schedule:', error);
                setResponse({ status: 'error', message: 'Xoá lịch học thất bại!' });
                setSnackbarOpen(true);
            },
        });
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Quản lý lịch học
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Tìm kiếm theo tên"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} md={6}>
                    <FormControl size="small" sx={{ minWidth: 140, width: 'auto' }}>
                        <InputLabel>Lọc theo thứ</InputLabel>
                        <Select value={filterDay} label="Lọc theo thứ" onChange={(e) => setFilterDay(e.target.value)}>
                            <MenuItem value="">Tất cả</MenuItem>
                            {weekdays.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {paginatedSchedules.length === 0 ? (
                    <Typography variant="body1" sx={{ m: 2 }}>
                        Không có lịch học phù hợp.
                    </Typography>
                ) : (
                    paginatedSchedules.map((schedule) => (
                        <Grid item xs={12} md={6} key={schedule._id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6">{schedule.title}</Typography>
                                        <Box>
                                            <IconButton onClick={() => onEdit(schedule)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => onDelete(schedule)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2">Thứ: {schedule.days.join(', ')}</Typography>
                                    <Typography variant="body2">
                                        Giờ học: {schedule.startTime} - {schedule.endTime}
                                    </Typography>
                                    <Typography variant="body2">Lặp lại: {schedule.repeat}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredSchedules.length / pageSize)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            <EditScheduleDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                onSave={(updatedSchedule) => {
                    handleEdit(updatedSchedule);
                    setOpenEditDialog(false);
                }}
                schedule={selectedSchedule}
            />

            {/* Hộp thoại xác nhận xoá */}
            {openDeleteDialog && (
                <DialogConfirm
                    openDialog={openDeleteDialog}
                    onClose={() => setDeleteOpenDialog(false)}
                    onDelete={() => handleDelete(selectedSchedule)}
                    text={`Bạn có chắc chắn muốn xoá lịch học "${selectedSchedule?.title}"?`}
                />
            )}

            {snackbarOpen && (
                <SnackbarAlert snackbarOpen={snackbarOpen} onClose={() => setSnackbarOpen(false)} response={response} />
            )}
        </Box>
    );
};

export default Schedules;
