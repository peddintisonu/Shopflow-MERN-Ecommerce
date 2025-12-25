import useAuth from "../hooks/useAuth.js";

import { Link } from "react-router-dom";

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center space-x-6">
                <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                />
                <div>
                    <h2 className="text-4xl font-bold">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-xl text-gray-400">@{user.username}</p>
                    <p className="text-lg text-gray-300 mt-2">{user.email}</p>
                </div>
            </div>
            <div className="mt-8 flex gap-4">
                <Link
                    to="/update-profile"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
                >
                    Edit Profile
                </Link>
                <Link
                    to="/change-password"
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold"
                >
                    Change Password
                </Link>
                <Link
                    to="/update-avatar"
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-semibold"
                >
                    Change Avatar
                </Link>
            </div>
        </div>
    );
};

export default Profile;
