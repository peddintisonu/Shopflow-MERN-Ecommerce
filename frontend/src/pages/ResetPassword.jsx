import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ otp: "", newPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axiosInstance.post("/auth/reset-password", {
                email, // Sending email along with otp can be a good practice
                otp: formData.otp,
                newPassword: formData.newPassword,
            });
            // Redirect to signin page on success
            navigate("/signin");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <p className="text-center mt-10">
                Email not found. Please start the forgot password process again.
            </p>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Reset Your Password
            </h2>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </p>
            )}
            <p className="text-center text-gray-400 mb-6">
                Enter the code sent to {email} and your new password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm">
                        Reset Code (OTP)
                    </label>
                    <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength="6"
                        required
                        className="w-full p-3 text-center text-2xl tracking-[1em] bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
