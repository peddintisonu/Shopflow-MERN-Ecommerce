import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js"; 

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/signin");
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                Shopflow
            </Link>
            <nav>
                <ul className="flex space-x-4 items-center">
                    <li>
                        <Link to="/" className="hover:text-gray-300">
                            Home
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:text-gray-300"
                                >
                                    {user?.username || "Profile"}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/signin"
                                    className="hover:text-gray-300"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="hover:text-gray-300"
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
