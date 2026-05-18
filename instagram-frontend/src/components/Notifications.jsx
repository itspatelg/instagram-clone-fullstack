import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');

    const fetchNotifications = async () => {
        try {
            // Backend API call
            const res = await axios.get(`http://https://instagram-clone-fullstack-production.up.railway.app/api/notifications?email=${userEmail}`);
            setNotifications(res.data);
        } catch (err) {
            console.error("Notifications fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchNotifications();
        }
    }, [userEmail]);

    if (loading) return <div style={{ marginLeft: '240px', padding: '20px' }}>Loading notifications...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', marginLeft: '240px', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: '10px', fontWeight: 'bold' }}>Notifications</h2>
            
            {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#8e8e8e' }}>
                    <div style={{ fontSize: '50px' }}>🔔</div>
                    <h3>No notifications yet</h3>
                    <p>When someone likes your post or follows you, you'll see it here.</p>
                </div>
            ) : (
                notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'center', padding: '15px 10px', borderBottom: '1px solid #fafafa' }}>
                        {/* Profile Icon Placeholder */}
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#efefef', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            👤
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '14px' }}>
                                <strong style={{ cursor: 'pointer' }}>{n.senderUsername}</strong> {n.message.replace(n.senderUsername, "")}
                            </span>
                            <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '4px' }}>
                                {new Date(n.createdAt).toLocaleString()}
                            </div>
                        </div>

                        {/* Follow Button (Sirf Follow notification ke liye) */}
                        {n.type === 'FOLLOW' && (
                            <button style={{ backgroundColor: '#0095f6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                                Follow
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;