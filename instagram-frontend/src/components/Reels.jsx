import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/posts/all');
                // FIXED: res.data ki jagah res.data.posts
                setReels(res.data.posts || []); 
            } catch (err) {
                console.error("Reels fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReels();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>Loading Reels...</div>;

    return (
        <div style={{
            height: '100vh',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '240px' // Sidebar gap fix
        }}>
            {reels.map((reel) => (
                <div 
                    key={reel.id} 
                    style={{
                        minWidth: '100%',
                        height: '100vh',
                        scrollSnapAlign: 'start',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    <img 
                        src={reel.imageUrl} 
                        alt="reel" 
                        style={{ 
                            height: '90%', 
                            borderRadius: '8px',
                            boxShadow: '0 0 20px rgba(255,255,255,0.1)'
                        }} 
                    />

                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '350px',
                        color: 'white',
                        padding: '20px',
                        textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px' }}></div>
                            <span style={{ fontWeight: 'bold' }}>{reel.user?.username || 'user'}</span>
                            <button style={{ marginLeft: '10px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>Follow</button>
                        </div>
                        <p>{reel.caption}</p>
                    </div>

                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        color: 'white',
                        fontSize: '28px'
                    }}>
                        <div style={{ textAlign: 'center' }}>❤️<br/><span style={{ fontSize: '12px' }}>{reel.likesCount || 0}</span></div>
                        <div style={{ textAlign: 'center' }}>💬<br/><span style={{ fontSize: '12px' }}>{reel.comments?.length || 0}</span></div>
                        <div style={{ textAlign: 'center' }}>✈️</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Reels;