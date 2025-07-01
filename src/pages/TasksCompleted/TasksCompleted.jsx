import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    TextField,
    InputAdornment,
    MenuItem,
    IconButton,
    Grid,
    Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CardTask from '../../components/CardTask/CardTask';
import SnackbarAlert from '../../components/SnackbarAlert';
import DialogConfirm from '../../components/DialogConfirm';
import LoadingDialog from '../../components/LoadingDialog';
import { useTasks, useDeleteTask } from '../../hooks/tasks';
import { useStatusPriority } from '../../hooks/status-priority';

export default function TasksCompleted() {
    const { data: tasks = [], isLoading, isFetching } = useTasks();
    const { priorityTask } = useStatusPriority();
    const deleteTask = useDeleteTask();

    const [allTasks, setAllTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [search, setSearch] = useState('');
    const [priority, setPriority] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [response, setResponse] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            const subTasks = tasks.reduce((acc, task) => {
                const tmp = (task.subtasks || []).map((subtask) => ({
                    ...subtask,
                    maintask: task.task_name,
                    maintask_id: task._id,
                }));
                acc.push(...tmp);
                return acc;
            }, []);

            setAllTasks([...tasks, ...subTasks]);
        }
    }, [tasks]);

    const filteredTasks = allTasks.filter(
        (task) =>
            task.task_name.toLowerCase().includes(search.toLowerCase()) &&
            (priority === '' || task.priority._id === priority) &&
            task.completed === true,
    );

    const paginatedTasks = filteredTasks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    if (isLoading || isFetching) {
        return (
            <Typography variant="h6" align="center">
                Loading...
            </Typography>
        );
    }

    const handleOpenDialog = (task) => {
        setSelectedTask(task);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    const handleDelete = (task) => {
        setResponse({});
        setSnackbarOpen(false);

        if (task.maintask_id) {
            // Nếu là subtask thì tìm maintask chứa subtask cần xóa
            const mainTask = tasks.find((t) => t._id === task.maintask_id);
            if (mainTask) {
                // Xóa subtask khỏi maintask
                const updatedSubtasks = mainTask.subtasks.filter((subtask) => subtask._id !== task._id);

                // Update lại maintask
                updateTask.mutate(
                    {
                        ...mainTask,
                        subtasks: updatedSubtasks,
                    },
                    {
                        onSuccess: () => {
                            setResponse({
                                status: 'success',
                                message: `Đã xóa subtask "${task.task_name}"`,
                            });
                            setSnackbarOpen(true);
                        },
                        onError: (error) => {
                            setResponse({
                                status: 'error',
                                message: `Lỗi khi xoá subtask "${task.task_name}"`,
                            });
                            setSnackbarOpen(true);
                        },
                    },
                );
            }
        } else {
            // Nếu là task chính thì xóa
            deleteTask.mutate(task._id, {
                onSuccess: () => {
                    setResponse({
                        status: 'success',
                        message: `Đã xoá task "${task.task_name}"`,
                    });
                    setSnackbarOpen(true);
                },
                onError: (error) => {
                    setResponse({
                        status: 'error',
                        message: `Lỗi khi xoá task "${task.task_name}"`,
                    });
                    setSnackbarOpen(true);
                },
            });
        }

        handleCloseDialog();
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 5, mb: 5 }}>
            <LoadingDialog open={deleteTask.isPending} />

            <Typography variant="h4" fontWeight={700} mb={3}>
                Danh sách công việc đã hoàn thành
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm theo tên công việc..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1 }}
                />
                <TextField
                    select
                    label="Độ ưu tiên"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    sx={{ width: 180 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {priorityTask.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <Grid container spacing={2}>
                {paginatedTasks.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography color="text.secondary" align="center">
                            Không có công việc nào phù hợp.
                        </Typography>
                    </Grid>
                ) : (
                    paginatedTasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task._id}>
                            <Box position="relative">
                                <CardTask task={task} />
                                <IconButton
                                    aria-label="Xóa"
                                    color="error"
                                    size="small"
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                                    onClick={() => handleOpenDialog(task)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))
                )}
            </Grid>

            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(filteredTasks.length / rowsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            <DialogConfirm
                openDialog={openDialog}
                onClose={handleCloseDialog}
                onDelete={() => handleDelete(selectedTask)}
                text={`Bạn có chắc chắn muốn xóa công việc "${selectedTask?.task_name}"?`}
            />

            {response.message && (
                <SnackbarAlert snackbarOpen={snackbarOpen} onClose={() => setSnackbarOpen(false)} response={response} />
            )}
        </Box>
    );
}
