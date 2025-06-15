import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

const RouteGuard = ({ children, requiresAuth }) => {
    const { user } = useAuth();

    if (requiresAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    if (!requiresAuth && user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RouteGuard;
