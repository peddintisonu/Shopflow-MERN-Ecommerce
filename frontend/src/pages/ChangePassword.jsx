import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post("/users/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setMessage("Password changed successfully!");
            // Clear form and redirect
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => navigate("/profile"), 2000);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Change Password
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm">
                        Current Password
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600"
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
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
