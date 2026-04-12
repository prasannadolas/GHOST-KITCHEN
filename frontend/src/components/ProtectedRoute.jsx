import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null; // Wait for auth to check session

    if (!user) {
        // Not logged in? Redirect to login
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Wrong role? Redirect to home
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;