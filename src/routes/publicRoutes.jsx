// src/routes/publicRoutes.jsx
import Home from '../pages/Home';
import Test from '../pages/Test';
import AddTask from '../pages/AddTask';
import DefaultLayout from '../layouts/DefaultLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import AddSchedule from '../pages/AddSchedule';
import SchedulePage from '../pages/SchedulePage';
import UncompletedTasksPage from '../pages/UncompletedTasksPage';

const publicRoutes = [
  { path: '/', component: Home, layout: DefaultLayout, requiresAuth: true },
  { path: '/add-task', component: AddTask, layout: DefaultLayout, requiresAuth: true },
  { path: '/add-schedule', component: AddSchedule, layout: DefaultLayout, requiresAuth: true },
  { path: '/test', component: Test, layout: DefaultLayout, requiresAuth: true },
  { path: '/tasks', component: Tasks, layout: DefaultLayout, requiresAuth: true },
  { path: '/login', component: Login, layout: null, requiresAuth: false },
  { path: '/register', component: Register, layout: null, requiresAuth: false },
  { path: '/schedules', component: SchedulePage, layout: DefaultLayout, requiresAuth: true },
  { path: '/uncompleted-tasks', component: UncompletedTasksPage, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;