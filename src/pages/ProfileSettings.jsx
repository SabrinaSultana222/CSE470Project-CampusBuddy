import React, { useState } from 'react';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    fullName: 'Sabaha Sadik Prachi',
    email: 'prachi@university.edu',
    major: 'CSE',
    year: '3rd Year',
    bio: 'Passionate about tech and music 🎵',
    notifyEmail: true,
    theme: 'light',
  });

  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
  };

  return (
    <div className="profile-container p-6 max-w-5xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Profile Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left section - Avatar */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center md:w-1/3">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-32 h-32 mx-auto rounded-full mb-4 object-cover border-2 border-blue-600"
          />
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            onChange={handleAvatar}
            className="hidden"
          />
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload New Photo
          </label>

          <h2 className="mt-4 text-lg font-semibold">{form.fullName}</h2>
          <p className="text-gray-500">{form.email}</p>
        </div>

        {/* Right section - Profile form */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex-1">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-2">Major</label>
            <input
              type="text"
              name="major"
              value={form.major}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
              rows="4"
            ></textarea>

            <label className="flex items-center mb-3 gap-2">
              <input
                type="checkbox"
                name="notifyEmail"
                checked={form.notifyEmail}
                onChange={handleChange}
              />
              <span>Email Notifications</span>
            </label>

            <label className="block mb-2">Theme Preference</label>
            <select
              name="theme"
              value={form.theme}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>

          {/* Password change form */}
          <form onSubmit={handlePasswordSubmit} className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <label className="block mb-2">Current Password</label>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-2">New Password</label>
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded mb-3"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
