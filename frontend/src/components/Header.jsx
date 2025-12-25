import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/signin");
    };

    return (
        <header className="bg-gray-800 p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-orange-500">
                    Shopflow
                </Link>
                <ul className="flex items-center gap-6">
                    <li>
                        <Link to="/" className="hover:text-orange-400">
                            Home
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:text-orange-400"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                                >
                                    Logout
                                </button>
                            </li>
                            <li className="flex items-center gap-2">
                                <img
                                    src={user?.avatar}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span>{user?.username}</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/signin"
                                    className="hover:text-orange-400"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
