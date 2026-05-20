import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ArrowLeft, Settings } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container" style={{ padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
      <button 
        className="btn btn-outline" 
        style={{ position: 'absolute', top: '2rem', left: '2rem' }}
        onClick={() => navigate('/chat')}
      >
        <ArrowLeft size={18} /> Back to Terminal
      </button>

      <div className="profile-container animate-fade-in" style={{ width: '100%' }}>
        <div className="profile-header">
          <img 
            src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=eab308&color=09090b"} 
            alt="Profile Avatar" 
            className="profile-avatar-large"
          />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user?.name || 'Unknown Operator'}</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{user?.email || 'unregistered@antigravity.sys'}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <User size={18} /> Edit Identity Data
          </button>
          
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Settings size={18} /> System Preferences
          </button>

          <button 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            onClick={handleLogout}
          >
            <LogOut size={18} /> Sever Connection (Logout)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
