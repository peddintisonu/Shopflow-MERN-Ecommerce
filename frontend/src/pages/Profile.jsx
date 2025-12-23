import useAuth from "../hooks/useAuth";

const Profile = () => {
    const { user } = useAuth();
    console.log("Profile component user data:", user);

    return (
        <div className="text-center mt-8">
            <h1 className="text-3xl font-bold">Profile Page</h1>
            {user ? (
                <div className="mt-4">
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full mx-auto"
                    />
                    <p className="mt-2 text-lg">
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p className="text-lg">
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-lg">
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;
