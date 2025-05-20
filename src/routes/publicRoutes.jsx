// src/routes/publicRoutes.jsx
import Home from '../pages/Home';
import Test from '../pages/Test';
import AddTask from '../pages/AddTask';
import DefaultLayout from '../layouts/DefaultLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import AddSchedule from '../pages/AddSchedule';
import Schedule from '../pages/Schedule';
import TasksUncompleted from '../pages/TasksUncompleted';
import ProfilePage from '../pages/ProfilePage';
import EditProfilePage from '../pages/EditProfilePage';

const publicRoutes = [
  { path: '/', component: Home, layout: DefaultLayout, requiresAuth: true },
  { path: '/add-task', component: AddTask, layout: DefaultLayout, requiresAuth: true },
  { path: '/add-schedule', component: AddSchedule, layout: DefaultLayout, requiresAuth: true },
  { path: '/test', component: Test, layout: DefaultLayout, requiresAuth: true },
  { path: '/tasks', component: Tasks, layout: DefaultLayout, requiresAuth: true },
  { path: '/login', component: Login, layout: null, requiresAuth: false },
  { path: '/register', component: Register, layout: null, requiresAuth: false },
  { path: '/schedules', component: Schedule, layout: DefaultLayout, requiresAuth: true },
  { path: '/uncompleted-tasks', component: TasksUncompleted, layout: DefaultLayout, requiresAuth: true },
  { path: '/profile', component: ProfilePage, layout: DefaultLayout, requiresAuth: true },
  { path: '/profile/edit', component: EditProfilePage, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;