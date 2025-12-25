import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import useAuth from "../hooks/useAuth.js";

const UpdateAvatar = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Effect to handle navigation after a successful update
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                navigate("/profile");
            }, 2000); // Redirect after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newAvatarFile) {
            setError("Please select an image to upload.");
            return;
        }

        setError("");
        setMessage("");
        setLoading(true);

        const data = new FormData();
        data.append("avatar", newAvatarFile);

        try {
            const response = await axiosInstance.patch(
                "/users/update-avatar",
                data
            );

            // 1. Update global state
            setUser(response.data.data);

            // 2. Set success message to trigger the navigation effect
            setMessage("Avatar updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update avatar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Update Avatar
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

            <div className="flex flex-col items-center mb-6">
                <p className="text-sm text-gray-400 mb-2">Avatar Preview</p>
                <img
                    src={preview || user?.avatar}
                    alt="Avatar preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-600"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                        Choose New Avatar
                    </label>
                    <input
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || message}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Uploading..." : "Upload & Save"}
                </button>
            </form>
        </div>
    );
};

export default UpdateAvatar;
