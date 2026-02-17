import './ProfileSettings.css';
import { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectField from '../components/SelectField';
import ThemeToggle from '../components/ThemeToggle';
import { getToken, authFetch, setUser } from '../utils/api';
import { useToast } from '../context/ToastContext';

const ProfileSettings = () => {
  const [form, setForm] = useState({
    fullName: 'Sabaha Sadik Prachi',
    email: 'prachi@university.edu',
    studentId: '',
    major: 'CSE',
    year: '3rd Year',
    gender: '',
    bio: 'Passionate about tech and music 🎵',
    notifyEmail: true,
    theme: 'light',
  });

  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { showToast } = useToast();
  const toast = { showToast };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📸 Avatar upload started:', file.name, file.type, file.size);
      
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        if (toast && toast.showToast) toast.showToast('Only JPG, PNG, and GIF images are allowed', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        if (toast && toast.showToast) toast.showToast('File size must be less than 5MB', 'error');
        return;
      }
      
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      
      // Upload to server if logged in
      const token = getToken();
      if (token) {
        try {
          const formData = new FormData();
          formData.append('avatar', file);
          
          console.log('📤 Uploading to server...');
          const API_BASE = 'http://localhost:5001';
          const response = await fetch(`${API_BASE}/api/profile/avatar`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });
          
          console.log('📥 Response status:', response.status);
          const text = await response.text();
          console.log('📄 Response text:', text);
          
          const data = text ? JSON.parse(text) : {};
          if (response.ok && data.avatarUrl) {
            // Convert relative URL to absolute URL
            const fullUrl = data.avatarUrl.startsWith('http') 
              ? data.avatarUrl 
              : `http://localhost:5001${data.avatarUrl}`;
            setAvatar(fullUrl);
            console.log('✅ Avatar uploaded:', fullUrl);
            if (toast && toast.showToast) toast.showToast('Avatar uploaded successfully', 'success');
          } else {
            throw new Error(data.error || 'Failed to upload avatar');
          }
        } catch (err) {
          console.error('❌ Avatar upload error:', err);
          if (toast && toast.showToast) toast.showToast(err.message || 'Failed to upload avatar', 'error');
          // Revert to previous avatar on error
          try {
            const user = await authFetch('/api/profile');
            if (user && user.avatarUrl) setAvatar(user.avatarUrl);
            else setAvatar('https://via.placeholder.com/150');
          } catch (revertErr) {
            setAvatar('https://via.placeholder.com/150');
          }
        }
      }
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
      // Persist to backend if logged in
      const token = getToken();
      if (token) {
        setSaving(true);
        console.log('💾 Saving profile...');
        console.log('📤 Sending data:', { 
          name: form.fullName, 
          email: form.email,
          studentId: form.studentId || undefined, 
          major: form.major || undefined, 
          year: form.year || undefined, 
          gender: form.gender || undefined, 
          bio: form.bio || undefined 
        });
        
        authFetch('/api/profile', { 
          method: 'PUT', 
          body: { 
            name: form.fullName, 
            email: form.email,
            studentId: form.studentId || undefined, 
            major: form.major || undefined, 
            year: form.year || undefined, 
            gender: form.gender || undefined, 
            bio: form.bio || undefined 
          } 
        })
          .then((res) => {
            console.log('✅ Profile update response:', res);
            if (res && res.user) {
              setUser({ id: res.user._id, name: res.user.name, email: res.user.email });
              // Update form state with the server response to ensure all fields are saved
              setForm({ 
                fullName: res.user.name || '', 
                email: res.user.email || '', 
                studentId: res.user.studentId || '', 
                major: res.user.major || '', 
                year: res.user.year || '', 
                gender: res.user.gender || '', 
                bio: res.user.bio || '', 
                notifyEmail: true, 
                theme: 'light' 
              });
              if (res.user.avatarUrl) {
                const fullUrl = res.user.avatarUrl.startsWith('http') 
                  ? res.user.avatarUrl 
                  : `http://localhost:5001${res.user.avatarUrl}`;
                setAvatar(fullUrl);
              }
            }
            setErrors({});
            if (toast && toast.showToast) toast.showToast('Profile updated successfully', 'success');
          })
          .catch((err) => {
            console.error('❌ Profile update error:', err);
            if (err && err.errors) {
              // map validation errors to fields
              const apiErrors = {};
              err.errors.forEach(e => { apiErrors[e.param] = e.msg; });
              setErrors({
                fullName: apiErrors.name || apiErrors.fullName || '',
                email: apiErrors.email || '',
                major: apiErrors.major || '',
              });
            } else {
              if (toast && toast.showToast) toast.showToast(err && err.error ? err.error : 'Failed to update profile', 'error');
            }
          })
          .finally(() => setSaving(false));
      } else {
        if (toast && toast.showToast) toast.showToast('Profile updated locally (not saved to server)', 'info');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length === 0) {
      const token = getToken();
      if (!token) return toast && toast.showToast ? toast.showToast('Please login to change password', 'info') : null;
      
      setChangingPassword(true);
      console.log('🔑 Changing password...');
      
      authFetch('/api/profile/password', { 
        method: 'PUT', 
        body: { 
          currentPassword: passwords.current, 
          newPassword: passwords.new 
        } 
      })
        .then(() => {
          console.log('✅ Password changed successfully');
          if (toast && toast.showToast) toast.showToast('Password changed successfully', 'success');
          setPasswords({ current: '', new: '' });
          setPasswordErrors({});
        })
        .catch((err) => {
          console.error('❌ Password change error:', err);
          if (err && err.errors) {
            const apiErrors = {};
            err.errors.forEach(e => { apiErrors[e.param] = e.msg; });
            setPasswordErrors({ 
              current: apiErrors.currentPassword || apiErrors.current || '', 
              new: apiErrors.newPassword || apiErrors.new || '' 
            });
          } else {
            const errorMsg = err && err.error ? err.error : 'Failed to change password';
            if (toast && toast.showToast) toast.showToast(errorMsg, 'error');
          }
        })
        .finally(() => setChangingPassword(false));
    } else {
      setPasswordErrors(newErrors);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let mounted = true;
    authFetch('/api/profile')
      .then((data) => {
        if (!mounted || !data) return;
        setForm({ fullName: data.name || '', email: data.email || '', studentId: data.studentId || '', major: data.major || '', year: data.year || '', gender: data.gender || '', bio: data.bio || '', notifyEmail: true, theme: 'light' });
        if (data.avatarUrl) {
          // If avatarUrl is relative, prepend the server URL
          const fullUrl = data.avatarUrl.startsWith('http') 
            ? data.avatarUrl 
            : `http://localhost:5001${data.avatarUrl}`;
          setAvatar(fullUrl);
        }
      })
      .catch((err) => {
        console.warn('Failed to load profile', err);
      });
    return () => { mounted = false; };
  }, []);

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
    { value: 'ENGLISH', label: 'English' },
    { value: 'MICRO', label: 'Microbiology' },
    { value: 'BIOTECH', label: 'Biotechnology' },
    { value: 'ANTHROPO', label: 'Anthropology' },
    { value: 'MATH', label: 'Mathematics' },
    { value: 'PHYSICS', label: 'Physics' },
    { value: 'LAW', label: 'Law' },
    { value: 'BBA', label: 'BBA (Business Administration)' },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="profile-settings">
      <div className="theme-toggle-wrapper" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}>
        <ThemeToggle />
      </div>

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
                {form.studentId && <p className="student-id">ID: {form.studentId}</p>}
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

                <Input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  label="Student ID"
                  error={errors.studentId}
                />

                <SelectField
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  options={majorOptions}
                  label="Major"
                  error={errors.major}
                />

                <SelectField
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  options={yearOptions}
                  label="Academic Year"
                  required
                />

                <SelectField
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  label="Gender"
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

                <Button type="submit" variant="success" size="lg" isLoading={saving}>
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

                <Button type="submit" variant="primary" size="lg" isLoading={changingPassword}>
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