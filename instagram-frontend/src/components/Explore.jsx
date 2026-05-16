import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext'; // Dark mode support

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPost, setHoveredPost] = useState(null);
    const navigate = useNavigate();
    const { isDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/posts/all');
                // FIXED: Backend ab Map bhej raha hai { posts: [], isLast: boolean }
                setPosts(res.data.posts || []); 
            } catch (err) {
                console.error("Explore fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', marginLeft: '240px', color: 'var(--text-color)' }}>Loading Explore...</div>;

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '935px', 
            margin: '0 auto', 
            marginLeft: '240px',
            backgroundColor: 'var(--bg-color)', // Theme color
            minHeight: '100vh',
            color: 'var(--text-color)' // Theme text
        }}>
            <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}>Explore</div>

            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h3>Bhai database mein koi post hi nahi hai! Pehle Create page se post dalo.</h3>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '4px', 
                    paddingBottom: '50px'
                }}>
                    {posts.map((post) => (
                        <div 
                            key={post.id} 
                            onMouseEnter={() => setHoveredPost(post.id)}
                            onMouseLeave={() => setHoveredPost(null)}
                            onClick={() => navigate(`/profile/${post.user?.username}`)}
                            style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', cursor: 'pointer', backgroundColor: 'var(--border-color)' }}
                        >
                            <img 
                                src={post.imageUrl} 
                                alt="explore" 
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {hoveredPost === post.id && (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', gap: '15px' }}>
                                    <span>❤️ {post.likesCount || 0}</span>
                                    <span>💬 {post.comments?.length || 0}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;