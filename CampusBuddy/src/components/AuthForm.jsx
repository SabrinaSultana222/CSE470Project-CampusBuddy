import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import './AuthForm.css';

const AuthForm = ({ mode = 'signin' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (mode === 'signup') {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      alert(`${mode === 'signin' ? 'Sign in' : 'Sign up'} successful!`);
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'signin' 
            ? 'Sign in to your CampusBuddy account' 
            : 'Join CampusBuddy today'}
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              label="Full Name"
              error={errors.fullName}
              required
            />
          )}
          
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            label="Email"
            error={errors.email}
            required
          />
          
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            label="Password"
            error={errors.password}
            required
          />
          
          {mode === 'signup' && (
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              label="Confirm Password"
              error={errors.confirmPassword}
              required
            />
          )}
          
          <Button type="submit" variant="primary" size="lg">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        
        <p className="auth-toggle">
          {mode === 'signin' 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
