import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiUserCheck, 
  FiDollarSign, 
  FiPiggyBank,
  FiBell,
  FiChevronDown,
  FiSearch
} from 'react-icons/fi';
import { Sidebar } from '../components/Sidebar';
import { SearchBar } from '../components/SearchBar';
import { UserTable } from '../components/UserTable';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuthStore();
  const { fetchUsers, users, filteredUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const getActiveUsersCount = () => {
    return filteredUsers.filter(user => {
      const lastActive = new Date(user.lastActiveDate);
      const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceActive <= 7;
    }).length;
  };

  const getUsersWithLoansCount = () => {
    // Simulate users with loans (every 3rd user)
    return Math.floor(users.length / 3);
  };

  const getUsersWithSavingsCount = () => {
    // Simulate users with savings (every 2nd user)
    return Math.floor(users.length / 2);
  };
  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="logo">
          <div className="logo-icon"></div>
          <div className="logo-text">lendsqr</div>
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for anything"
          />
          <button className="search-button">
            <FiSearch color="#FFFFFF" size={14} />
          </button>
        </div>
        
        <div className="nav-right">
          <a href="#" className="docs-link">Docs</a>
          <FiBell className="notification-icon" color="#213F7D" />
          <div className="user-profile">
            <img 
              src={user?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'} 
              alt={user?.name} 
              className="user-avatar"
            />
            <span className="user-name">{user?.name || 'Adedeji'}</span>
            <FiChevronDown color="#213F7D" />
          </div>
        </div>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="switch-org">
            <FiUsers size={16} color="#213F7D" />
            <span className="switch-org-text">Switch Organization</span>
            <FiChevronDown size={14} color="#213F7D" />
          </div>
          
          <div className="nav-section">
            <div className="nav-item">
              <FiUsers size={16} color="#213F7D" />
              <span className="nav-item-text">Dashboard</span>
            </div>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Customers</div>
            <div className="nav-item active">
              <FiUsers size={16} color="#213F7D" />
              <span className="nav-item-text">Users</span>
            </div>
            <div className="nav-item">
              <FiUsers size={16} color="#213F7D" />
              <span className="nav-item-text">Guarantors</span>
            </div>
            <div className="nav-item">
              <FiDollarSign size={16} color="#213F7D" />
              <span className="nav-item-text">Loans</span>
            </div>
            <div className="nav-item">
              <FiUserCheck size={16} color="#213F7D" />
              <span className="nav-item-text">Decision Models</span>
            </div>
            <div className="nav-item">
              <FiPiggyBank size={16} color="#213F7D" />
              <span className="nav-item-text">Savings</span>
            </div>
          </div>
          
          <div className="nav-footer">
            <div className="logout-item">
              <FiUsers size={16} color="#213F7D" />
              <span className="logout-text">Logout</span>
            </div>
            <div className="version-text">v1.2.0</div>
          </div>
        </div>
      </div>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">Users</h1>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <FiUsers size={20} color="#DF18FF" />
            </div>
            <div className="stat-label">Users</div>
            <div className="stat-value">{users.length.toLocaleString()}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon active-users">
              <FiUserCheck size={20} color="#5718FF" />
            </div>
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{getActiveUsersCount().toLocaleString()}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon loans">
              <FiDollarSign size={20} color="#F55F44" />
            </div>
            <div className="stat-label">Users with Loans</div>
            <div className="stat-value">{getUsersWithLoansCount().toLocaleString()}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon savings">
              <FiPiggyBank size={20} color="#FF3366" />
            </div>
            <div className="stat-label">Users with Savings</div>
            <div className="stat-value">{getUsersWithSavingsCount().toLocaleString()}</div>
          </div>
        </div>
        
        {/* Users Table */}
        <UserTable />
      </div>
    </div>
  );
};