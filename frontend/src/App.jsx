import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import Header from "./components/Header";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdateProfile from "./pages/UpdateProfile";
import VerifyEmail from "./pages/VerifyEmail";
import UpdateAvatar from "./pages/UpdateAvatar.jsx";

function App() {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/update-profile"
                            element={<UpdateProfile />}
                        />
                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />
                        <Route
                            path="/update-avatar"
                            element={<UpdateAvatar />}
                        />
                    </Route>
                </Routes>
            </main>
        </div>
    );
}

export default App;
