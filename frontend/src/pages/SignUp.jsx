import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const data = new FormData();
        // Append all text fields from the formData state
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        // Append the file if one was selected
        if (avatarFile) {
            data.append("avatar", avatarFile);
        }

        try {
            await axiosInstance.post("/auth/register", data, {
                // Axios automatically sets the correct header for FormData
                // but you can be explicit if you want.
                headers: { "Content-Type": "multipart/form-data" },
            });
            // On success, navigate to the verification page, passing the email
            navigate("/verify-email", { state: { email: formData.email } });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
                Create an Account
            </h2>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium text-gray-300">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium text-gray-300">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">
                        Avatar (Optional)
                    </label>
                    <input
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <Link to="/signin" className="text-orange-400 hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
};

export default SignUp;
