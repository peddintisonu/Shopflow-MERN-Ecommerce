import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { axiosInstance } from "../api/axios";

const UpdateProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Initialize state only once with user data
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // This effect will run ONLY when `message` changes to a non-empty string
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                navigate("/profile");
            }, 1500); // Redirect after 1.5 seconds

            // Cleanup function to clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axiosInstance.patch(
                "/users/update-profile",
                formData
            );

            // 1. Update the global state
            setUser(response.data.data);

            // 2. Set the success message. This will trigger the useEffect above.
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Edit Profile
            </h2>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                    {error}
                </p>
            )}
            {message && (
                <p className="bg-green-500 text-white p-3 rounded mb-4 text-center">
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || message}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
