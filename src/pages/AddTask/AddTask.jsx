import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    TextField,
    Button,
    FormControl,
    Box,
    Typography,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    capitalize,
} from '@mui/material';
import SnackbarAlert from '../../components/SnackbarAlert';
import DateTimeOrTimeRangePicker from '../../components/DateTimeOrTimeRangePicker';
import Selection from '../../components/Form/Selection';
import ListTasks from '../../components/ListTasks';
import LoadingDialog from '../../components/LoadingDialog';
import { useAuth } from '../../hooks/auth';
import { useStatusPriority } from '../../hooks/status-priority';
import { useTasks, useUpdateTask, useCreateTask } from '../../hooks/tasks';

const AddTask = () => {
    const { statusTask, priorityTask } = useStatusPriority();
    const { user } = useAuth();
    const { data: tasks } = useTasks();
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dateTimeRange, setDateTimeRange] = useState(() => ({
        start: new Date(),
        end: new Date(),
    }));
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [mainTasks, setMainTasks] = useState([]);
    const [subTasks, setSubTasks] = useState([]);
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [mainTask, setMainTask] = useState(null);
    const [taskType, setTaskType] = useState('main');
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchMainTasks = () => {
            if (tasks && tasks.length > 0) {
                const activeTasks = tasks.filter((task) => {
                    const currentDate = new Date();
                    return new Date(task.end_date) >= currentDate;
                });

                const subTasks = activeTasks.reduce((acc, task) => {
                    let tmp = task.subtasks.map((subtask) => {
                        return {
                            ...subtask,
                            maintask: task.task_name,
                        };
                    });
                    acc.push(...tmp);
                    return acc;
                }, []);

                setMainTasks(activeTasks);
                setSubTasks(subTasks);
            }
        };

        fetchMainTasks();
    }, [tasks]);

    const menuitems = useMemo(() => mainTasks.map((task) => ({ value: task._id, label: task.task_name })), [mainTasks]);

    const handleTaskTypeChange = (e) => {
        setTaskType(e.target.value);

        if (e.target.value === 'main') {
            setMainTask(null);
            setDateTimeRange((prev) => {
                return {
                    ...prev,
                    start: new Date(),
                    end: new Date(),
                };
            });
        } else {
            const selectedTask = mainTasks.find((task) => task._id === mainTask);
            if (selectedTask) {
                setDateTimeRange((prev) => {
                    return {
                        ...prev,
                        start: new Date(selectedTask.start_date),
                        end: new Date(selectedTask.end_date),
                    };
                });
            }
        }
    };

    const handleDateTimeChange = useCallback((newRange) => {
        setDateTimeRange((prevRange) => {
            // So sánh để tránh update không cần thiết
            if (
                prevRange.start?.getTime() === newRange.start?.getTime() &&
                prevRange.end?.getTime() === newRange.end?.getTime()
            ) {
                return prevRange;
            }
            return newRange;
        });
    }, []);

    const handleStatusChange = useCallback((event) => {
        setStatus(event.target.value);
    }, []);

    const handlePriorityChange = useCallback((event) => {
        setPriority(event.target.value);
    }, []);

    const handleMainTaskChange = useCallback(
        (event) => {
            const mainTask = mainTasks.find((task) => task._id === event.target.value);
            if (!mainTask) return;
            setMainTask(mainTask);

            const selectedTask = mainTasks.find((task) => task._id === event.target.value);
            setDateTimeRange((prev) => {
                // Chỉ cập nhật nếu giá trị mới khác với giá trị hiện tại
                if (prev.start !== selectedTask.start_date || prev.end !== selectedTask.end_date) {
                    return {
                        ...prev,
                        start: new Date(selectedTask.start_date),
                        end: new Date(selectedTask.end_date),
                    };
                }
                return prev;
            });
        },
        [mainTasks, mainTask],
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskName || !taskDescription || !status || !priority) {
            setResponse({
                status: 'error',
                message: 'Vui lòng điền đầy đủ thông tin',
            });
            setSnackbarOpen(true);
            return;
        }

        if (dateTimeRange.start > dateTimeRange.end) {
            setResponse({
                status: 'error',
                message: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc',
            });
            setSnackbarOpen(true);
            return;
        }

        if (mainTask !== null) {
            const selectedMainTask = mainTasks.find((task) => task._id === mainTask._id);
            if (!selectedMainTask) return;
            const taskData = {
                ...selectedMainTask,
                subtasks: [
                    ...selectedMainTask.subtasks,
                    {
                        task_name: taskName,
                        task_description: taskDescription,
                        status,
                        priority,
                        start_date: dateTimeRange.start,
                        end_date: dateTimeRange.end,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            };
            updateTask.mutate(taskData, {
                onSuccess: () => {
                    setResponse({
                        status: 'success',
                        message: `Thêm task "${taskName}" vào task chính "${selectedMainTask.task_name}" thành công`,
                    });
                    setSnackbarOpen(true);

                    setMainTasks((prev) => {
                        const updatedMainTasks = prev.map((task) => {
                            if (task._id === mainTask) {
                                return taskData;
                            }
                            return task;
                        });
                        return updatedMainTasks;
                    });

                    setSubTasks((prev) => [
                        ...prev,
                        {
                            ...taskData.subtasks[taskData.subtasks.length - 1],
                            maintask: selectedMainTask.task_name,
                        },
                    ]);
                },
                onError: (error) => {
                    setResponse({
                        status: 'error',
                        message: `Có lỗi xảy ra khi thêm task: ${error.message}`,
                    });
                    setSnackbarOpen(true);
                },
            });
        } else {
            const taskData = {
                userid: user._id,
                task_name: taskName,
                task_description: taskDescription,
                status,
                priority,
                start_date: dateTimeRange.start,
                end_date: dateTimeRange.end,
                subtasks: [],
            };
            createTask.mutate(taskData, {
                onSuccess: () => {
                    setResponse({
                        status: 'success',
                        message: `Thêm task "${taskName}" thành công`,
                    });
                    setSnackbarOpen(true);

                    setMainTasks((prev) => [
                        ...prev,
                        {
                            ...taskData,
                        },
                    ]);
                },
                onError: (error) => {
                    setResponse({
                        status: 'error',
                        message: `Có lỗi xảy ra khi thêm task: ${error.message}`,
                    });
                    setSnackbarOpen(true);
                },
            });
        }

        setTaskName('');
        setTaskDescription('');
        setMainTask(null);
        setStatus('');
        setPriority('');
        setTaskType('main');
        setDateTimeRange({
            start: new Date(),
            end: new Date(),
            mode: 'datetime',
        });
    };

    return (
        <>
            <LoadingDialog open={createTask.isPending || updateTask.isPending} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 5 }}>
                <Box sx={{ flex: 1, maxWidth: 600 }}>
                    <Typography variant="h4" mb={3}>
                        Thêm Task mới
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Tên Task"
                            name="taskName"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />

                        <TextField
                            label="Mô tả"
                            name="description"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />

                        <Selection
                            title="Trạng thái"
                            name="status"
                            value={status}
                            onChange={handleStatusChange}
                            menuitems={useMemo(
                                () => [...statusTask.map((s) => ({ value: s._id, label: capitalize(s.name) }))],
                                [statusTask],
                            )}
                        />

                        <Selection
                            title="Độ ưu tiên"
                            name="priority"
                            value={priority}
                            onChange={handlePriorityChange}
                            menuitems={useMemo(
                                () => [...priorityTask.map((p) => ({ value: p._id, label: capitalize(p.name) }))],
                                [priorityTask],
                            )}
                        />

                        {mainTasks && mainTasks.length > 0 ? (
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Chọn loại task</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="taskType"
                                    name="taskType"
                                    value={taskType}
                                    onChange={handleTaskTypeChange}
                                >
                                    <FormControlLabel value="main" control={<Radio />} label="Task chính" />
                                    <FormControlLabel value="sub" control={<Radio />} label="Task phụ" />
                                </RadioGroup>
                            </FormControl>
                        ) : (
                            <FormLabel component="legend">Loại task: Main task</FormLabel>
                        )}

                        {taskType === 'sub' && (
                            <Selection
                                title="Chọn task chính"
                                name="mainTask"
                                value={mainTask?._id || ''}
                                onChange={handleMainTaskChange}
                                menuitems={menuitems}
                            />
                        )}

                        <Divider sx={{ my: 2 }} />

                        <FormControl fullWidth margin="normal">
                            <DateTimeOrTimeRangePicker
                                value={dateTimeRange}
                                mainTask={mainTask}
                                onChange={handleDateTimeChange}
                            />
                        </FormControl>

                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Thêm Task
                        </Button>
                    </form>
                </Box>

                <Box sx={{ flex: 1, maxWidth: 600 }}>
                    <Typography variant="h4" mb={3}>
                        Danh sách task
                    </Typography>
                    <ListTasks
                        tasks={useMemo(
                            () =>
                                [...mainTasks, ...subTasks]
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .splice(0, 5),
                            [mainTasks, subTasks],
                        )}
                    />
                </Box>

                {response && (
                    <SnackbarAlert
                        snackbarOpen={snackbarOpen}
                        onClose={() => setSnackbarOpen(false)}
                        response={response}
                    />
                )}
            </Box>
        </>
    );
};

export default AddTask;
