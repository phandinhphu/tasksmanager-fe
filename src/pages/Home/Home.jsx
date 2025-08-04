import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Box from '@mui/material/Box';
import tippy from 'tippy.js';
import TaskDetail from '../../components/TaskDetail';
import SnackbarAlert from '../../components/SnackbarAlert';
import dayjs from '../../utils/dayjsConfig';
import moment from 'moment';
import * as taskServices from '../../services/taskServices';
import { useTasks, useUpdateTask } from '../../hooks/tasks';
import { useSchedules } from '../../hooks/schedules';
import '../../style/calendar.css';
import 'tippy.js/dist/tippy.css';

const Home = () => {
    const { data: tasks = [], isLoading: isLoadingTasks, isFetching: isFetchingTasks } = useTasks();
    const { data: schedules = [], isLoading: isLoadingSchedules, isFetching: isFetchingSchedules } = useSchedules();
    const updateTask = useUpdateTask();

    const [taskDetail, setTaskDetail] = useState(null);
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [response, setResponse] = useState({});

    useEffect(() => {
        const handleGenerateEvents = (tasks) => {
            const tasksFiltered = tasks.filter((t) => t.completed === false && t.status.name !== 'Overdue');

            return tasksFiltered
                ? tasksFiltered.flatMap((task) => {
                      const startDate = dayjs(task.start_date);
                      const endDate = dayjs(task?.extend_date || task.end_date);

                      // Kiểm tra xem task có kéo dài nhiều ngày không
                      const isMultiDay = endDate.diff(startDate, 'day') > 0;

                      return {
                          id: `task-${task._id}`,
                          group: `task-${task._id}`,
                          title: task.task_name,
                          start: startDate.format('YYYY-MM-DDTHH:mm:ss'),
                          end: endDate.format('YYYY-MM-DDTHH:mm:ss'),
                          description: task.task_description,
                          status: task.status,
                          priority: task.priority,
                          subtasks: task.subtasks,
                          allDay: isMultiDay, // Task kéo dài nhiều ngày sẽ hiển thị dạng all-day
                          extendedProps: {
                              taskId: task._id,
                              extend_date: task?.extend_date
                                  ? dayjs(task.extend_date).format('YYYY-MM-DDTHH:mm:ss')
                                  : null,
                              isExtension: true,
                              isMultiDay: isMultiDay,
                              description: task.task_description,
                              status: task.status,
                              priority: task.priority,
                              subtasks: task.subtasks,
                              category: 'task',
                          },
                          backgroundColor: '#7c3aed',
                          borderColor: '#7c3aed',
                      };
                  })
                : [];
        };

        const fetchData = async () => {
            const taskEvents = handleGenerateEvents(tasks);

            // Generate weekly recurring schedule events for the next 2 weeks
            const today = moment().startOf('week'); // Sunday
            const next14Days = Array.from({ length: 14 }, (_, i) => moment(today).add(i, 'days'));

            const scheduleEvents = [];
            if (schedules && schedules.length > 0) {
                schedules.forEach((schedule) => {
                    next14Days.forEach((day) => {
                        if (schedule.days.includes(day.format('dddd'))) {
                            const start = `${day.format('YYYY-MM-DD')}T${schedule.startTime}`;
                            const end = `${day.format('YYYY-MM-DD')}T${schedule.endTime}`;
                            scheduleEvents.push({
                                id: `schedule-${schedule._id}-${day.format('YYYY-MM-DD')}`,
                                title: schedule.title,
                                start,
                                end,
                                backgroundColor: '#d97706',
                                borderColor: '#d97706',
                                extendedProps: {
                                    category: 'schedule',
                                },
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
        return (
            <Typography variant="h6" align="center">
                Loading...
            </Typography>
        );
    }

    if (isFetchingTasks || isFetchingSchedules) {
        return (
            <Typography variant="h6" align="center">
                Tải lại dữ liệu...
            </Typography>
        );
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
            isMultiDay: info.event.extendedProps?.isMultiDay || false,
        });
        setOpen(true); // Open the task detail dialog
    };

    const handleCloseDetails = () => {
        setTaskDetail(null);
        setOpen(false); // Close the task detail dialog
    };

    const handleResize = async (taskId, newEndDate, info) => {
        try {
            const task = await taskServices.getTaskById(taskId);
            if (!task) {
                info.revert();
                setResponse({
                    status: 'error',
                    message: 'Công việc không tồn tại.',
                });
                return;
            }

            const taskEnd = task?.extend_date ? task.extend_date : task.end_date;

            if (taskEnd && newEndDate && dayjs(newEndDate).isBefore(dayjs(taskEnd))) {
                info.revert();
                setResponse({
                    status: 'error',
                    message: 'Ngày kết thúc mới không thể trước ngày kết thúc hiện tại.',
                });
                return;
            }

            const updatedTask = {
                ...task,
                extend_date: newEndDate ? dayjs(newEndDate).toISOString() : null,
            };

            updateTask.mutate(updatedTask, {
                onSuccess: () => {
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.id === `task-${taskId}`
                                ? {
                                      ...event,
                                      end: newEndDate ? dayjs(newEndDate).format('YYYY-MM-DDTHH:mm:ss') : null,
                                      extendedProps: {
                                          ...event.extendedProps,
                                          extend_date: newEndDate
                                              ? dayjs(newEndDate).format('YYYY-MM-DDTHH:mm:ss')
                                              : null,
                                      },
                                  }
                                : event,
                        ),
                    );
                    setResponse({
                        status: 'success',
                        message: 'Cập nhật thời gian thành công.',
                    });
                },
                onError: (error) => {
                    console.error('Error updating task:', error);
                    setResponse({
                        status: 'error',
                        message: 'Có lỗi xảy ra khi cập nhật thời gian. Vui lòng thử lại.',
                    });
                },
            });
        } catch (error) {
            console.error('Error resizing task:', error);
            alert('Có lỗi xảy ra khi cập nhật thời gian. Vui lòng thử lại.');
        } finally {
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'background.paper',
                // Thêm CSS để hiển thị cursor pointer khi hover vào events
                '& .fc-event': {
                    cursor: 'pointer',
                },
                '& .fc-event:hover': {
                    cursor: 'pointer',
                },
                // Đặc biệt cho events trong dayGrid (month view)
                '& .fc-daygrid-event': {
                    cursor: 'pointer',
                },
                // Đặc biệt cho events trong timeGrid (week/day view)
                '& .fc-timegrid-event': {
                    cursor: 'pointer',
                },
            }}
        >
            <div
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    }}
                    editable={true}
                    weekends={true}
                    dayMaxEvents={2}
                    eventStartEditable={false}
                    eventDurationEditable={true}
                    eventResizableFromStart={false}
                    allDaySlot={true}
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    events={events}
                    eventClick={(info) => {
                        if (info.event.id.startsWith('schedule-')) {
                            return; // Ignore schedule events
                        }
                        // Handle event click here
                        handleViewDetails(info);
                    }}
                    eventResize={(info) => {
                        if (info.event.id.startsWith('schedule-')) {
                            info.revert();
                            alert(
                                'Không thể chỉnh sửa thời gian của lịch biểu. Vui lòng vào tab Schedules để chỉnh sửa.',
                            );
                            return;
                        }

                        const taskId = info.event.extendedProps.taskId;
                        const newEndDate = info.event.end ? info.event.end.toISOString() : null;

                        handleResize(taskId, newEndDate, info);
                    }}
                    height="auto"
                    expandRows={true}
                    moreLinkClick="popover"
                    nowIndicator={true}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Tất cả các ngày trong tuần
                        startTime: '00:00',
                        endTime: '24:00',
                    }}
                    scrollTime="08:00:00"
                    scrollTimeReset={false}
                    moreLinkContent={(args) => {
                        return `+${args.num} more`;
                    }}
                    eventDidMount={(info) => {
                        tippy(info.el, {
                            content: info.event.title,
                        });
                    }}
                />
            </div>

            {taskDetail !== null && (
                <TaskDetail
                    open={open} // Pass the open state to TaskDetail
                    task={taskDetail}
                    onClose={handleCloseDetails} // Pass the close handler to TaskDetail
                />
            )}

            {snackbarOpen && (
                <SnackbarAlert snackbarOpen={snackbarOpen} onClose={() => setSnackbarOpen(false)} response={response} />
            )}
        </Box>
    );
};

export default Home;
