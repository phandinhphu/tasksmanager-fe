import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Box from '@mui/material/Box';
import TaskDetail from '../../components/TaskDetail';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import moment from 'moment';
import { useTasks } from '../../hooks/tasks';
import { useSchedules } from '../../hooks/schedules';

dayjs.extend(isSameOrBefore);

const Home = () => {
    const { data: tasks, isLoading: isLoadingTasks, isFetching: isFetchingTasks } = useTasks();
    const { data: schedules, isLoading: isLoadingSchedules, isFetching: isFetchingSchedules } = useSchedules();
    const [taskDetail, setTaskDetail] = useState(null);
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const handleGenerateEvents = (tasks) => {
            return tasks ? tasks.flatMap((task) => ({
                id: `task-${task.id}`,
                group: `task-${task.id}`,
                title: task.task_name,
                start: task.start_date,
                end: task?.extend_date || task.end_date,
                description: task.task_description,
                status: task.status,
                priority: task.priority,
                subtasks: task.subtasks,
                backgroundColor: '#4caf50',
                extendedProps: {
                    taskId: task.id,
                    extend_date: task?.extend_date || null,
                    isExtension: false
                }
            })) : [];
        }

        const fetchData = async () => {
            const taskEvents = handleGenerateEvents(tasks);

            // Generate weekly recurring schedule events for the next 2 weeks
            const today = moment().startOf('week'); // Sunday
            const next14Days = Array.from({ length: 14 }, (_, i) => moment(today).add(i, 'days'));
            
            const scheduleEvents = [];
            if (schedules && schedules.length > 0) {
                schedules.forEach(schedule => {
                    next14Days.forEach(day => {
                        if (schedule.days.includes(day.format('dddd'))) {
                            const start = `${day.format('YYYY-MM-DD')}T${schedule.startTime}`;
                            const end = `${day.format('YYYY-MM-DD')}T${schedule.endTime}`;
                            scheduleEvents.push({
                                id: `schedule-${schedule.id}-${day.format('YYYY-MM-DD')}`,
                                title: schedule.title,
                                start,
                                end,
                                backgroundColor: '#2196f3'
                            });
                        }
                    });
                });
            }
            setEvents([...taskEvents, ...scheduleEvents]);
        };

        fetchData();
    }, [tasks, schedules]);

    if (isLoadingTasks || isLoadingSchedules) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    if (isFetchingTasks || isFetchingSchedules) {
        return <Typography variant="h6" align="center">Tải lại dữ liệu...</Typography>;
    }

    const handleViewDetails = (info) => {
        setTaskDetail({
            title: info.event.title,
            description: info.event.extendedProps.description,
            status: info.event.extendedProps.status,
            priority: info.event.extendedProps.priority,
            subtasks: info.event.extendedProps.subtasks,
            start: info.event.start ? info.event.start.toISOString() : null,
            end: info.event.end ? info.event.end.toISOString() : null,
            extend_date: info.event.extendedProps?.extend_date || null,
        });
        setOpen(true); // Open the task detail dialog
    }

    const handleCloseDetails = () => {
        setTaskDetail(null);
        setOpen(false); // Close the task detail dialog
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'background.paper',
            }}
        >
            <div
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        // left: 'prev,next today',
                        // center: 'title',
                        // right: 'dayGridMonth,dayGridWeek,dayGridDay',
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    editable={true}
                    allDaySlot={false}
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    events={events}
                    eventClick={(info) => {
                        if (info.event.id.startsWith('schedule-')) {
                            return; // Ignore schedule events
                        }
                        // Handle event click here
                        console.log('Clicked event:', info);
                        handleViewDetails(info);
                    }}
                    height="auto"
                />
            </div>

            {taskDetail !== null && (
                <TaskDetail
                    open={open} // Pass the open state to TaskDetail
                    task={taskDetail}
                    onClose={handleCloseDetails} // Pass the close handler to TaskDetail
                />
            )}
        </Box>
    );
}

export default Home;