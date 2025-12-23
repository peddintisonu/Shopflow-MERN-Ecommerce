import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (avatar) {
            data.append("avatar", avatar);
        }

        try {
            await axiosInstance.post("/auth/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/signin");
        } catch (err) {
            console.error("Full Axios Error:", err);
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold text-center">
                Create an Account
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Avatar
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
