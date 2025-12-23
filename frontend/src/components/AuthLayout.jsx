import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthLayout = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show a loading state while the initial auth check is happening
    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    // If authenticated, render the child component (e.g., Profile page)
    if (isAuthenticated) {
        return children;
    }

    // If not authenticated, redirect to the sign-in page
    // We pass the original location in state so we can redirect back after login.
    return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default AuthLayout;
