import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Profile from './components/Profile';
import Explore from './components/Explore';
import Signup from './components/Signup';
import Login from './components/Login';
import Reels from './components/Reels';
import EditProfile from './components/EditProfile';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import AIChat from './components/AIChat'; 

// --- Theme Imports ---
import { ThemeProvider } from './context/ThemeContext'; 
import './styles/Global.css'; 
import './styles/Skeleton.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userEmail'));
  
  // Dynamic screen checker parent level par
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('userEmail'));
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        {/* Mobile par display block hoga taki sidebar content ko squeeze na kare */}
        <div style={{ display: isMobile ? 'block' : 'flex' }}>
          
          {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
          
          {/* Sabsé Badi Galti Ka Ilaaj: MarginLeft mobile par auto 0px ho jayega */}
          <div style={{ 
            marginLeft: isAuthenticated ? (isMobile ? '0px' : '240px') : '0', 
            flex: 1, 
            backgroundColor: 'var(--bg-color)', 
            color: 'var(--text-color)',
            minHeight: '100vh',
            transition: '0.3s ease'
          }}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
              
              <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
              <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/home" />} />

              <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path="/profile/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/explore" element={isAuthenticated ? <Explore /> : <Navigate to="/login" />} />
              <Route path="/reels" element={isAuthenticated ? <Reels /> : <Navigate to="/login" />} />
              <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
              <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
              <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
              
              {/* --- AI Chat Route --- */}
              <Route path="/ai-chat" element={isAuthenticated ? <AIChat /> : <Navigate to="/login" />} />

              <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '100px' }}><h2>404 - Page Not Found</h2></div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
