import { Box, Card, CardContent, Typography, Avatar, Grid, Container, Divider } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../hooks/auth';
import { useStatsTasks } from '../../hooks/tasks';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfilePage = () => {
    const { user } = useAuth();
    const { data: statsTasks = {}, isLoading, isFetching } = useStatsTasks();

    if (isLoading || isFetching) {
        return (
            <Typography variant="h6" align="center">
                Loading...
            </Typography>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, p: 2 }}>
            <Card>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={user.avatar || 'https://via.placeholder.com/64'}
                            alt={user.name}
                            sx={{ width: 64, height: 64, border: '2px solid #1976d2' }}
                        />
                        <Box>
                            <Typography variant="h5">{user.name}</Typography>
                            <Typography color="text.secondary">Email: {user.email}</Typography>
                            <Typography color="text.secondary">
                                Thành viên từ: {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Thống kê công việc
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <Card sx={{ backgroundColor: '#e3f2fd' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Tổng công việc</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {statsTasks.total}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Card sx={{ backgroundColor: '#e8f5e9' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Hoàn thành</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="green">
                                        {statsTasks.completed}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Card sx={{ backgroundColor: '#fff3e0' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Đang làm</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="orange">
                                        {statsTasks.inProgress}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Card sx={{ backgroundColor: '#ffebee' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Quá hạn</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="red">
                                        {statsTasks.overdue}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Card sx={{ backgroundColor: '#f3e5f5' }}>
                                <CardContent>
                                    <Typography color="text.secondary">Tổng công việc phụ</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="#6a1b9a">
                                        {statsTasks.subtasks}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {statsTasks.completed || statsTasks.inProgress || statsTasks.overdue ? (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Biểu đồ công việc
                    </Typography>
                    <Box maxWidth={400} mx="auto">
                        <Pie
                            data={{
                                labels: ['Hoàn thành', 'Đang làm', 'Quá hạn'],
                                datasets: [
                                    {
                                        data: [statsTasks.completed, statsTasks.inProgress, statsTasks.overdue],
                                        backgroundColor: ['#66bb6a', '#ffa726', '#ef5350'],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            ) : (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Không đủ dữ liệu để hiển thị biểu đồ
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default ProfilePage;
