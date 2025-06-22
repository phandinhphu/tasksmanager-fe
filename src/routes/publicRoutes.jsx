import { lazy } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';

const Home = lazy(() => import('../pages/Home'));
const AddTask = lazy(() => import('../pages/AddTask'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Tasks = lazy(() => import('../pages/Tasks'));
const AddSchedule = lazy(() => import('../pages/AddSchedule'));
const Todos = lazy(() => import('../pages/Todos'));
const Schedules = lazy(() => import('../pages/Schedules'));
const Profile = lazy(() => import('../pages/Profile'));
const AccountSetting = lazy(() => import('../pages/AccountSetting'));
const About = lazy(() => import('../pages/About'));
const Help = lazy(() => import('../pages/Help'));
const TasksCompleted = lazy(() => import('../pages/TasksCompleted'));
const TasksOverdue = lazy(() => import('../pages/TasksOverdue'));
const VerifySuccess = lazy(() => import('../pages/VerifySuccess'));
const VerifyFail = lazy(() => import('../pages/VerifyFail'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Feedback = lazy(() => import('../pages/Feedback'));

const publicRoutes = [
    { path: '/', component: Home, layout: DefaultLayout, requiresAuth: true },
    { path: '/add-task', component: AddTask, layout: DefaultLayout, requiresAuth: true },
    { path: '/add-schedule', component: AddSchedule, layout: DefaultLayout, requiresAuth: true },
    { path: '/todos', component: Todos, layout: DefaultLayout, requiresAuth: true },
    { path: '/schedules', component: Schedules, layout: DefaultLayout, requiresAuth: true },
    { path: '/tasks', component: Tasks, layout: DefaultLayout, requiresAuth: true },
    { path: '/login', component: Login, layout: null, requiresAuth: false },
    { path: '/register', component: Register, layout: null, requiresAuth: false },
    { path: '/profile', component: Profile, layout: DefaultLayout, requiresAuth: true },
    { path: '/profile/me', component: Profile, layout: DefaultLayout, requiresAuth: true },
    { path: '/account-setting', component: AccountSetting, layout: DefaultLayout, requiresAuth: true },
    { path: '/about', component: About, layout: DefaultLayout, requiresAuth: true },
    { path: '/help', component: Help, layout: DefaultLayout, requiresAuth: true },
    { path: '/tasks-completed', component: TasksCompleted, layout: DefaultLayout, requiresAuth: true },
    { path: '/tasks-overdue', component: TasksOverdue, layout: DefaultLayout, requiresAuth: true },
    { path: '/verify-success', component: VerifySuccess, layout: null, requiresAuth: false },
    { path: '/verify-fail', component: VerifyFail, layout: null, requiresAuth: false },
    { path: '/reset-password', component: ResetPassword, layout: null, requiresAuth: false },
    { path: '/feedback', component: Feedback, layout: DefaultLayout, requiresAuth: true },
];

export default publicRoutes;
