import React from 'react';
import "../assets/styles/styles.css";
import "../assets/styles/loginStyle.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: ''
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
    return formData.emailAddress && formData.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful:', data);
      
      navigate('/games');

      window.dispatchEvent(new Event('userLoggedIn'));
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='account-screen'>
      <div className='login-container'>
        <h1>Login</h1>
        <form className='login-form' onSubmit={handleSubmit}>
          {error && (
            <div style={{
              color: 'red', 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: '#ffebee',
              borderRadius: '4px'
            }}>
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
            />
          </div>
          
          <div class="login-btn-container">
            <button 
              type="submit" 
              class="btn-primary"
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
