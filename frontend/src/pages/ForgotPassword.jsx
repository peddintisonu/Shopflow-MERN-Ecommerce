import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/forgot-password", {
                email,
            });
            setMessage(response.data.message);
            // Navigate to the reset page after a short delay so user sees the message
            setTimeout(() => {
                navigate("/reset-password", { state: { email } });
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to send reset code."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Forgot Password
            </h2>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </p>
            )}
            {message && (
                <p className="bg-green-500 text-white p-3 rounded mb-4">
                    {message}
                </p>
            )}
            <p className="text-center text-gray-400 mb-6">
                Enter your email address and we'll send you a code to reset your
                password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500"
                >
                    {loading ? "Sending Code..." : "Send Reset Code"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
