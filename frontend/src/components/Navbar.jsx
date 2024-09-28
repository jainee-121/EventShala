// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Navbar.css';
import { toast } from 'react-toastify';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN); // Check if user is logged in

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link className='link-logo-navbar'to="/">EventShala</Link>
            </div>
            <div className="navbar-links">
                <div className='links-div'>
                <Link to="/">Home</Link>
                <Link to="/notes">Events</Link>
                <Link to="/myprofile">My Profile</Link>
                <Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Link>
                </div>
                {isLoggedIn ? (
                    <Link to='/login'className='navbar-button' onClick={handleLogout}>Logout</Link>
                ) : (
                    <Link className='navbar-login' to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
