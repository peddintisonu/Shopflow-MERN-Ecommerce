import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await axiosInstance.post("/auth/verify-email", { otp });
            navigate("/signin");
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ... handleResend logic ...

    if (!email) {
        return (
            <p className="text-center mt-10">
                Email not found. Please sign up again.
            </p>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-2">
                Verify Your Account
            </h2>
            <p className="text-center text-gray-400 mb-6">
                A 6-digit code was sent to {email}
            </p>
            {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        required
                        className="w-full p-3 text-center text-2xl tracking-[1em] bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-lg font-bold disabled:bg-gray-500"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
                {/* Resend button here */}
            </form>
        </div>
    );
};

export default VerifyEmail;
