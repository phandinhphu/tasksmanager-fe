import { useTasks } from '../../hooks/tasks';
import { useUpdateTaskComplete, useUpdateSubtaskComplete } from '../../hooks/tasks';
import dayjs from '../../utils/dayjsConfig';
import LoadingDialog from '../../components/LoadingDialog';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import confetti from 'canvas-confetti';

const TaskCard = ({ task, onComplete }) => {
    const taskDate = dayjs(task?.extend_date || task?.end_date).tz();
    const now = dayjs().tz();
    const isOverdue = taskDate.isBefore(now);

    return (
        <Card
            variant="outlined"
            sx={{
                borderLeft: `6px solid ${task.status?.color || '#ccc'}`,
                mb: 2,
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{task.task_name}</Typography>
                    {task.status?.name !== 'Hoàn thành' && (
                        <Button variant="outlined" size="small" onClick={() => onComplete(task)}>
                            Hoàn thành
                        </Button>
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {task.task_description}
                </Typography>
                <Typography variant="caption">Hạn: {taskDate.format('DD/MM/YYYY HH:mm')}</Typography>
                {task.maintask_name && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        Task phụ của: {task.maintask_name}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

const TaskSection = ({ title, tasks, onComplete }) => (
    <Box mb={4}>
        <Typography variant="h5" gutterBottom>
            {title}
        </Typography>
        {tasks.length === 0 ? (
            <Typography color="text.secondary">Không có công việc nào.</Typography>
        ) : (
            tasks.map((task) => <TaskCard key={task._id || task.id} task={task} onComplete={onComplete} />)
        )}
    </Box>
);

const TodosPage = () => {
    const { data: tasks = [], isLoading } = useTasks();
    const updateTaskComplete = useUpdateTaskComplete();
    const updateSubtaskComplete = useUpdateSubtaskComplete();

    const handleComplete = (task) => {
        if (task.maintask_id) {
            updateSubtaskComplete.mutate(task, {
                onSuccess: () => {
                    confetti({
                        particleCount: 120,
                        angle: 60,
                        spread: 90,
                        origin: { x: 0, y: 0.5 },
                    });
                    confetti({
                        particleCount: 120,
                        angle: 120,
                        spread: 90,
                        origin: { x: 1, y: 0.5 },
                    });
                },
            });
        } else {
            updateTaskComplete.mutate(task, {
                onSuccess: () => {
                    confetti({
                        particleCount: 120,
                        angle: 60,
                        spread: 90,
                        origin: { x: 0, y: 0.5 },
                    });
                    confetti({
                        particleCount: 120,
                        angle: 120,
                        spread: 90,
                        origin: { x: 1, y: 0.5 },
                    });
                },
            });
        }
    };

    const now = dayjs().tz();
    const startOfToday = now.startOf('day');
    const endOfToday = now.endOf('day');
    const endOfSoon = now.add(3, 'day').endOf('day');

    const allSubtasks = tasks.flatMap(
        (task) =>
            task.subtasks?.map((sub) => ({
                ...sub,
                maintask_id: task._id,
                maintask_name: task.task_name,
            })) || [],
    );
    const allTasks = [...tasks, ...allSubtasks];

    const todayTasks = allTasks.filter(
        (task) =>
            dayjs(task.start_date).tz().isSameOrAfter(startOfToday) &&
            dayjs(task.start_date).tz().isSameOrBefore(endOfToday) &&
            task.status?.name === 'In Progress',
    );
    const upcomingTasks = allTasks.filter(
        (task) =>
            dayjs(task?.extend_date || task?.end_date)
                .tz()
                .isAfter(endOfToday) &&
            dayjs(task?.extend_date || task?.end_date)
                .tz()
                .isBefore(endOfSoon) &&
            task.status?.name === 'In Progress',
    );
    const overdueTasks = allTasks.filter(
        (task) =>
            dayjs(task?.extend_date || task?.end_date)
                .tz()
                .isBefore(startOfToday) && task.status?.name === 'Overdue',
    );

    return (
        <>
            <LoadingDialog open={updateTaskComplete.isPending || updateSubtaskComplete.isPending} />

            <Box p={3}>
                <Typography variant="h4" gutterBottom>
                    Việc cần làm
                </Typography>
                {isLoading ? (
                    <Typography>Đang tải công việc...</Typography>
                ) : (
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                        gap={2}
                    >
                        <TaskSection title="Hôm nay" tasks={todayTasks} onComplete={handleComplete} />
                        <TaskSection
                            title="Sắp đến hạn (3 ngày tới)"
                            tasks={upcomingTasks}
                            onComplete={handleComplete}
                        />
                        <TaskSection title="Quá hạn" tasks={overdueTasks} onComplete={handleComplete} />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default TodosPage;
