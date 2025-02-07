import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from 'lucide-react';
import '../css/Sidebar.css';

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-title">AI Notes</div>

        <div className="sidebar-menu">
          <div
            className={`sidebar-menu-item ${activeTab === '/dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="menu-icon">🏠</span>
            <span>Home</span>
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === '/favourites' ? 'active' : ''}`}
            onClick={() => navigate('/favourites')}
          >
            <span className="menu-icon">⭐</span>
            <span>Favourites</span>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="user-profile-container">
          <div 
            className="user-profile"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="user-circle">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="user-info">
              <span className="user-email">{userEmail || "No Email"}</span>
            </div>
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div 
                className="dropdown-item"
                onClick={() => {
                  navigate('/account');
                  setIsProfileOpen(false);
                }}
              >
                <User size={16} className="dropdown-icon" />
                <span>Account Details</span>
              </div>
              <div 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} className="dropdown-icon" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;