import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import Header from "./components/Header.jsx";
import AuthLayout from "./components/AuthLayout.jsx";

function App() {
    return (
        <BrowserRouter>
            {/* Header will be shown on all pages */}
            <Header />
            <main className="p-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Routes */}
                    <Route
                        path="/profile"
                        element={
                            <AuthLayout>
                                <Profile />
                            </AuthLayout>
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
