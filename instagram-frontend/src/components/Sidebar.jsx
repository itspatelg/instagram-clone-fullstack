import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = ({ setIsAuthenticated }) => {
    // Real-time resize listener taaki mobile state kabhi fail na ho
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        },
        { 
            name: 'Create', 
            icon: '➕', 
            action: () => setIsModalOpen(true) 
        },
        { name: 'Profile', icon: '👤', path: `/profile/${currentUsername}` },
    ];

    return (
        <>
            {/* 1. FIXED MOBILE TOP HEADER NAVBAR (Story ko chipne se bachayega) */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '54px',
                    background: isDarkMode ? '#1a1a1a' : 'white',
                    color: 'var(--text-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    borderBottom: `1px solid var(--border-color)`,
                    zIndex: 1500,
                    boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
                }}>
                    {/* Cursive Brand Text Left Side */}
                    <h3 
                        style={{ fontFamily: 'cursive', margin: 0, fontSize: '22px', cursor: 'pointer' }} 
                        onClick={() => navigate('/home')}
                    >
                        Instagram
                    </h3>
                    
                    {/* Hamburger Trigger Menu Right Side */}
                    <div
                        onClick={() => setIsSidebarOpen(true)}
                        style={{
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            userSelect: 'none'
                        }}
                    >
                        ☰
                    </div>
                </div>
            )}

            {/* 2. MAIN SIDEBAR BODY */}
            <div style={{
                width: isMobile ? '100%' : '240px', 
                maxWidth: '260px',
                height: '100vh',
                borderRight: isMobile ? 'none' : `1px solid var(--border-color)`,
                position: 'fixed',
                left: isMobile ? (isSidebarOpen ? '0' : '-280px') : '0',
                top: 0,
                background: isDarkMode ? '#1a1a1a' : 'white',
                display: 'flex',
                flexDirection: 'column', 
                padding: '20px 12px', 
                backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                color: 'var(--text-color)',
                zIndex: 1600,
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isMobile && isSidebarOpen ? '5px 0 15px rgba(0,0,0,0.2)' : 'none'
            }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2
                        style={{
                            fontFamily: 'cursive',
                            marginBottom: '30px',
                            paddingLeft: '12px',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            navigate('/home');
                            if (isMobile) setIsSidebarOpen(false);
                        }}
                    >
                        Instagram
                    </h2>

                    {/* Mobile Close Button (✖) */}
                    {isMobile && (
                        <span
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                fontSize: '24px',
                                cursor: 'pointer',
                                marginBottom: '25px',
                                paddingRight: '10px'
                            }}
                        >
                            ✖
                        </span>
                    )}
                </div>
                
                {/* MENU ITEMS LIST */}
                <div style={{ flex: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div 
                                key={item.name}
                                onClick={item.action ? () => { item.action(); if(isMobile && item.name !== 'Search') setIsSidebarOpen(false); } : () => {
                                    setIsSearchOpen(false);
                                    navigate(item.path);
                                    if (isMobile) setIsSidebarOpen(false); 
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
                                <span style={{ fontSize: '22px', marginRight: '16px' }}>
                                    {item.icon}
                                </span>
                                <span style={{ fontSize: '16px' }}>
                                    {item.name}
                                </span>
                            </div>
                        );
                    })}

                    {/* THEME TOGGLE BUTTON */}
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
                        <span style={{ fontSize: '22px', marginRight: '16px' }}>
                            {isDarkMode ? '☀️' : '🌙'}
                        </span>
                        <span style={{ fontSize: '16px' }}>
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <div 
                    onClick={handleLogout}
                    style={{ 
                        padding: '12px', cursor: 'pointer', display: 'flex', 
                        alignItems: 'center', borderRadius: '8px', color: '#ed4956', fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2a0000' : '#fff1f1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span style={{ fontSize: '22px', marginRight: '16px' }}>
                        🚪
                    </span>
                    <span>Logout</span>
                </div>
            </div>

            {/* 3. SEARCH DRAWER */}
            <div style={{
                position: 'fixed',
                left: isSearchOpen ? (isMobile ? '0' : '240px') : '-360px',
                top: isMobile ? '54px' : 0, 
                width: isMobile ? '100%' : '350px', 
                height: isMobile ? 'auto' : '100vh',
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-color)', 
                borderRight: isMobile ? 'none' : `1px solid var(--border-color)`,
                borderBottom: isMobile ? `1px solid var(--border-color)` : 'none',
                borderTopRightRadius: isMobile ? '0' : '16px', 
                borderBottomRightRadius: isMobile ? '0' : '16px',
                zIndex: 1550, 
                padding: '25px', 
                boxShadow: '10px 0 20px rgba(0,0,0,0.15)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSearchOpen ? 1 : 0,
                visibility: isSearchOpen ? 'visible' : 'hidden'
            }}>
                <h2 style={{ marginBottom: '20px', fontSize: '22px' }}>Search</h2>
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    style={{
                        width: '100%', padding: '10px 16px', borderRadius: '8px',
                        border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', 
                        color: 'var(--text-color)', outline: 'none', fontSize: '15px'
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