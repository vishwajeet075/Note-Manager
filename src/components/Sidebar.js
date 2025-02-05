import React, { useState } from 'react';
import '../css/Sidebar.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-title">AI Notes</div>
        
        <div className="sidebar-menu">
          <div 
            className={`sidebar-menu-item ${activeTab === 'Home' ? 'active' : ''}`}
            onClick={() => setActiveTab('Home')}
          >
            <span className="menu-icon">🏠</span>
            <span>Home</span>
          </div>
          <div 
            className={`sidebar-menu-item ${activeTab === 'Favourites' ? 'active' : ''}`}
            onClick={() => setActiveTab('Favourites')}
          >
            <span className="menu-icon">⭐</span>
            <span>Favourites</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="user-circle">E</div>
          <div className="user-info">
            <span className="user-name">Emmanuel Vincent</span>
            <span className="user-email">emmanuel@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;