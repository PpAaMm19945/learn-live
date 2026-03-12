import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import FeedbackWidget from './feedback/FeedbackWidget';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = ['parent', 'learner']
}) => {
    const { isAuthenticated, isLoading, roles, userId } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && roles.length > 0) {
        const hasAccess = roles.some(role => allowedRoles.includes(role));
        if (!hasAccess) {
            Logger.warn('[SEC]', `WARNING: Unauthorized access attempt to ${location.pathname}`);
            // Redirect based on their primary role (assuming first role)
            const primaryRole = roles[0];
            if (primaryRole === 'learner') {
                return <Navigate to={userId ? `/learner/${userId}` : '/login'} replace />;
            } else if (primaryRole === 'parent') {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    return (
        <>
            {children}
            {location.pathname !== '/onboarding' && <FeedbackWidget />}
        </>
    );
};
