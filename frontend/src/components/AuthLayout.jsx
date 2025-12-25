import useAuth from "../hooks/useAuth.js";

import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="text-center mt-20">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />; // This will render the nested child route (e.g., <Profile />)
};

export default AuthLayout;
