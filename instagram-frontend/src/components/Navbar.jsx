import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== "") {
            // URL change trigger karega
            navigate(`/profile/${searchTerm.trim()}`);
            setSearchTerm("");
        }
    };

    return (
        <nav style={{ background: 'white', borderBottom: '1px solid #dbdbdb', padding: '10px 20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
            <h2 onClick={() => navigate('/home')} style={{ fontFamily: 'cursive', cursor: 'pointer', margin: 0 }}>Instagram</h2>
            <div style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    style={{ background: '#fafafa', border: '1px solid #dbdbdb', padding: '5px 15px', borderRadius: '8px', width: '220px', textAlign: 'center' }} 
                />
            </div>
            <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
                <span onClick={() => navigate('/home')} style={{ cursor: 'pointer', fontSize: '22px' }}>🏠</span>
                <span onClick={() => navigate('/profile/itspatelg')} style={{ cursor: 'pointer', fontSize: '22px' }}>👤</span>
            </div>
        </nav>
    );
};

export default Navbar;