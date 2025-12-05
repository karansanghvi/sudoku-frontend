import React from 'react';
import "../assets/styles/styles.css";
import "../assets/styles/loginStyle.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
    verifyPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    if (error) setError('');
  };

  const isFormValid = () => {
    return formData.emailAddress && formData.password && formData.verifyPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Registration successful:', data);

      navigate('/games');
      window.dispatchEvent(new Event('userLoggedIn'));

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='account-screen'>
      <div className='login-container'>
        <h1>Register</h1>
        <form className='login-form' onSubmit={handleSubmit}>
          {error && (
            <div style={{
              color: 'red', 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: '#ffebee',
              borderRadius: '4px'
            }}
            >
              {error}
            </div>
          )}
          <div className='input-box'>
            <label htmlFor="emailAddress">Email Address:</label>
            <input 
              type="email" 
              id="emailAddress" 
              placeholder="john.doe@gmail.com"
              value={formData.emailAddress}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className='input-box'>
            <label htmlFor='password'>Password:</label>
            <input 
              type='password' 
              id='password' 
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="input-box">
            <label htmlFor="verifyPassword">Verify Password:</label>
            <input 
              type="password" 
              id="verifyPassword" 
              placeholder="Verify Password"
              value={formData.verifyPassword}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>
          
          <div className="login-btn-container">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
