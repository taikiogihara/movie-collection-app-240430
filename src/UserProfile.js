import React, { useState } from "react";
import "./UserProfile.css";

const UserProfile = ({ user, onUpdateUser, onChangePassword }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleUpdateUser = () => {
        onUpdateUser({ name, email });
    };

    const handleChangePassword = () => {
        onChangePassword(currentPassword, newPassword);
    };

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button onClick={handleUpdateUser}>Update Profile</button>
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
            />
            <button onClick={handleChangePassword}>Change Password</button>
        </div>
    );
};

export default UserProfile;