import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const SignIn = () => {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(formData.identifier, formData.password);
            navigate("/profile");
        } catch (err) {
            if (err.response?.status === 403) {
                // 403 for not verified
                setError(
                    "Account not verified. Please sign in with your email to verify."
                );
                navigate("/verify-email", {
                    state: { email: formData.identifier },
                });
            } else {
                setError(err.response?.data?.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Tailwind Form UI ---
    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Sign In
            </h2>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm">
                        Email or Username
                    </label>
                    <input
                        type="text"
                        name="identifier"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-orange-400 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default SignIn;
