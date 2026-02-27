import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/lib/auth';
import { Logger } from '@/lib/Logger';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = ['parent', 'learner']
}) => {
    const { isAuthenticated, role } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && !allowedRoles.includes(role)) {
        Logger.warn('[SEC WARNING]', `Unauthorized access attempt by ${role} to ${location.pathname}`);

        // Redirect based on their actual role
        if (role === 'learner') {
            const { userId } = useAuthStore.getState();
            return <Navigate to={userId ? `/learner/${userId}` : '/login'} replace />;
        } else if (role === 'parent') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};
