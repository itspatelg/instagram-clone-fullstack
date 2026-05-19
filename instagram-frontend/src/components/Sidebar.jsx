import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';
import { ThemeContext } from '../context/ThemeContext';


const Sidebar = ({ setIsAuthenticated }) => {

    
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        localStorage.clear();
        if (setIsAuthenticated) {
            setIsAuthenticated(false);
        }
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== "") {
            navigate(`/profile/${searchTerm.trim()}`);
            setIsSearchOpen(false);
            setSearchTerm("");
        }
    };

    const currentUsername = localStorage.getItem('username') || "profile";

    const menuItems = [
        { name: 'Home', icon: '🏠', path: '/home' },
        { 
            name: 'Search', 
            icon: '🔍', 
            action: () => setIsSearchOpen(!isSearchOpen) 
        },
        { name: 'Explore', icon: '🧭', path: '/explore' },
        { name: 'Reels', icon: '🎬', path: '/reels' },
        { name: 'Messages', icon: '📩', path: '/messages' },
        { name: 'Notifications', icon: '❤️', path: '/notifications' },
        { 
            name: 'AnkAI Assistant', 
            icon: '✨', 
            path: '/ai-chat' 
        }, // AI Chat Option Add Kiya
        { 
            name: 'Create', 
            icon: '➕', 
            action: () => setIsModalOpen(true) 
        },
        { name: 'Profile', icon: '👤', path: `/profile/${currentUsername}` },
    ];

    return (
        <>
           <div style={{

    width: window.innerWidth <= 768 ? '100%' : '240px',

    height: window.innerWidth <= 768 ? '70px' : '100vh',

    borderRight:
        window.innerWidth <= 768
            ? 'none'
            : `1px solid var(--border-color)`,

    borderTop:
        window.innerWidth <= 768
            ? `1px solid var(--border-color)`
            : 'none',

    position: 'fixed',

    left: 0,

    bottom: window.innerWidth <= 768 ? 0 : 'unset',

    top: window.innerWidth <= 768 ? 'unset' : 0,

    display: 'flex',

    flexDirection:
        window.innerWidth <= 768
            ? 'row'
            : 'column',

    justifyContent:
        window.innerWidth <= 768
            ? 'space-around'
            : 'flex-start',

    alignItems: 'center',

    padding:
        window.innerWidth <= 768
            ? '0px'
            : '20px 12px',

    backgroundColor: 'var(--card-bg)',

    color: 'var(--text-color)',

    zIndex: 100,

    transition: 'all 0.3s'
}}>
                <h2 style={{ fontFamily: 'cursive', marginBottom: '30px', paddingLeft: '12px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    Instagram
                </h2>
                
                <div style={{ flex: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div 
                                key={item.name}
                                onClick={item.action ? item.action : () => {
                                    setIsSearchOpen(false);
                                    navigate(item.path);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '12px',
                                    cursor: 'pointer', borderRadius: '8px', marginBottom: '4px',
                                    transition: 'background 0.3s',
                                    backgroundColor: isActive ? 'var(--bg-color)' : 'transparent',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '24px', marginRight: '16px' }}>{item.icon}</span>
                                <span style={{ fontSize: '16px' }}>{item.name}</span>
                            </div>
                        );
                    })}

                    <div 
                        onClick={toggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', padding: '12px',
                            cursor: 'pointer', borderRadius: '8px', marginTop: '10px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ fontSize: '24px', marginRight: '16px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
                        <span style={{ fontSize: '16px' }}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                </div>

                <div 
                    onClick={handleLogout}
                    style={{ 
                        padding: '12px', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', borderRadius: '8px', color: '#ed4956', fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2a0000' : '#fff1f1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span style={{ fontSize: '24px', marginRight: '16px' }}>🚪</span>
                    <span>Logout</span>
                </div>
            </div>

            <div style={{
                position: 'fixed',
                left: isSearchOpen ? '240px' : '-110px',
                top: 0, width: '350px', height: '100vh',
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-color)', 
                borderRight: `1px solid var(--border-color)`,
                borderTopRightRadius: '16px', borderBottomRightRadius: '16px',
                zIndex: 90, padding: '25px', boxShadow: '10px 0 20px rgba(0,0,0,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSearchOpen ? 1 : 0,
                visibility: isSearchOpen ? 'visible' : 'hidden'
            }}>
                <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>Search</h2>
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    style={{
                        width: '100%', padding: '12px 16px', borderRadius: '8px',
                        border: 'none', backgroundColor: 'var(--bg-color)', 
                        color: 'var(--text-color)', outline: 'none', fontSize: '16px'
                    }}
                />
            </div>

            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                
                
            />
            
        </>
    );
};


export default Sidebar;