import React, { useState } from 'react';
import "../assets/styles/styles.css";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Navbar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();

    const handleUserLogin = () => {
      checkLoginStatus();
    };

    window.addEventListener('userLoggedIn', handleUserLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  const checkLoginStatus = async () => {
   console.log('Checking login status...');
    try {
      const response = await fetch('http://localhost:5001/api/user/isLoggedIn', {  
        method: 'GET',
        credentials: 'include',
      });

      console.log('Login Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login Status Data:', data);
        setUser(data.user);
      } else {
        console.log('User is not logged in');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setUser(null);
    } finally {
      console.log('Finished checking login status');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        setDropdownOpen(false);
        navigate('/');
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className='navbar'>
        <h2 className='nav-title'>Sudoko</h2>

        <div className='hamburger' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-center-links ${menuOpen ? "active" : ""}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/games" onClick={() => setMenuOpen(false)}>Game Selection</Link></li>
            <li><Link to="/rules" onClick={() => setMenuOpen(false)}>Rules</Link></li>
            <li><Link to="/scores" onClick={() => setMenuOpen(false)}>Scores</Link></li>
        </ul>

        <div className='nav-right'>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <div className='user-dropdown-container'>
              <button 
                className='user-email-button'
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.emailAddress}
                <span className='dropdown-arrow'>{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              
              {dropdownOpen && (
                <div className='dropdown-menu'>
                  <button onClick={handleLogout} className='dropdown-item'>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
