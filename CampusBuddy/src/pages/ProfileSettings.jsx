import { useState } from 'react';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectField from '../components/SelectField';
import ThemeToggle from '../components/ThemeToggle';
import './ProfileSettings.css';

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
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: '' });
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
    setPasswordErrors({ ...passwordErrors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.major) newErrors.major = 'Major is required';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwords.current) newErrors.current = 'Current password is required';
    if (!passwords.new) newErrors.new = 'New password is required';
    if (passwords.new && passwords.new.length < 6) {
      newErrors.new = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Profile updated:', form);
      alert('Profile updated successfully!');
    } else {
      setErrors(newErrors);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length === 0) {
      console.log('Password changed');
      alert('Password changed successfully!');
      setPasswords({ current: '', new: '' });
    } else {
      setPasswordErrors(newErrors);
    }
  };

  const yearOptions = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
  ];

  const majorOptions = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'ENG', label: 'Electrical Engineering' },
    { value: 'MEC', label: 'Mechanical Engineering' },
    { value: 'BIO', label: 'Biomedical Engineering' },
  ];

  return (
    <div className="profile-settings">
      <ThemeToggle />

      <div className="profile-container">
        <h1 className="page-title">Profile Settings</h1>

        <div className="profile-layout">
          {/* Avatar Section */}
          <div className="profile-sidebar">
            <div className="avatar-section">
              <Avatar
                src={avatar}
                alt="User Avatar"
                size="lg"
                onUpload={handleAvatar}
                editable
              />
              <div className="user-info">
                <h2>{form.fullName}</h2>
                <p>{form.email}</p>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="profile-main">
            {/* Edit Profile Form */}
            <div className="form-card">
              <h2 className="form-title">Edit Profile</h2>
              <form onSubmit={handleSubmit} className="profile-form">
                <Input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  label="Full Name"
                  error={errors.fullName}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  label="Email"
                  error={errors.email}
                  required
                />

                <SelectField
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  options={majorOptions}
                  label="Major"
                  error={errors.major}
                  required
                />

                <SelectField
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  options={yearOptions}
                  label="Academic Year"
                  required
                />

                <div className="form-group">
                  <label htmlFor="bio" className="input-label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="textarea"
                    rows="4"
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="notifyEmail"
                    name="notifyEmail"
                    checked={form.notifyEmail}
                    onChange={handleChange}
                  />
                  <label htmlFor="notifyEmail">
                    Receive email notifications
                  </label>
                </div>

                <Button type="submit" variant="success" size="lg">
                  Save Profile
                </Button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="form-card">
              <h2 className="form-title">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <Input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  label="Current Password"
                  error={passwordErrors.current}
                  required
                />

                <Input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  label="New Password"
                  error={passwordErrors.new}
                  required
                />

                <Button type="submit" variant="primary" size="lg">
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
