import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { username } = useParams(); 
    const navigate = useNavigate(); 
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null); 
    const [isPostModalOpen, setIsPostModalOpen] = useState(false); 
    const [modalComment, setModalComment] = useState(""); 
    const [showBigHeart, setShowBigHeart] = useState(null); 
    
    // Real-time responsive dynamic state
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [likedPosts, setLikedPosts] = useState(new Set()); 
    const currentUserEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`https://instagram-clone-fullstack-production.up.railway.app/api/users/profile`, {
                params: { username: username, currentUserEmail: currentUserEmail }
            });
            setUserData(res.data);
            
            if (isPostModalOpen && selectedPost) {
                const updatedPost = res.data.posts.find(p => p.id === selectedPost.id);
                if (updatedPost) setSelectedPost(updatedPost);
            }
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Bhai ye user database mein nahi mila!");
        }
    };

    useEffect(() => {
        if (username) fetchProfile();
    }, [username]);

    const handleFollowToggle = async () => {
        try {
            await axios.post('https://instagram-clone-fullstack-production.up.railway.app/api/users/follow', {
                followerEmail: currentUserEmail,
                followingUsername: username
            });
            fetchProfile(); 
        } catch (err) {
            console.error("Follow error:", err);
        }
    };

    const handleModalLikeToggle = async (postId) => {
        const isCurrentlyLiked = likedPosts.has(postId);
        
        try {
            const res = await axios.post(`https://instagram-clone-fullstack-production.up.railway.app/api/posts/${postId}/toggle-like`, { 
                email: currentUserEmail,
                isLiked: isCurrentlyLiked
            });

            const newLikedPosts = new Set(likedPosts);
            if (isCurrentlyLiked) {
                newLikedPosts.delete(postId);
            } else {
                newLikedPosts.add(postId);
            }
            setLikedPosts(newLikedPosts);

            setSelectedPost(res.data);
            setUserData(prev => ({
                ...prev,
                posts: prev.posts.map(p => p.id === postId ? res.data : p)
            }));

        } catch (err) {
            console.error("Like error:", err);
        }
    };

    const handleModalDoubleTap = (postId) => {
        if (!likedPosts.has(postId)) {
            setShowBigHeart(postId);
            setTimeout(() => setShowBigHeart(null), 1000);
            handleModalLikeToggle(postId);
        }
    };

    const handleAddModalComment = async (postId) => {
        if (!modalComment.trim()) return;
        try {
            await axios.post('https://instagram-clone-fullstack-production.up.railway.app/api/comments/add', {
                postId: postId,
                text: modalComment,
                email: currentUserEmail
            });
            setModalComment(""); 
            fetchProfile(); 
        } catch (err) {
            console.error("Comment error:", err);
        }
    };

    if (error) return <div style={{ textAlign: 'center', marginTop: '100px' }}><h2>{error} 😕</h2></div>;
    if (!userData) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading Profile...</div>;

    const isOwnProfile = userData.email === currentUserEmail;

    return (
        <div style={{ 
            backgroundColor: '#fff', 
            minHeight: '100vh', 
            fontFamily: 'sans-serif', 
            marginLeft: isMobile ? '0px' : '240px',
            paddingTop: isMobile ? '60px' : '0px', // Header toggler space for mobile
            transition: 'all 0.3s ease'
        }}>
            <div style={{ maxWidth: '935px', margin: '0 auto', padding: isMobile ? '20px 10px' : '30px 20px' }}>
                
                {/* Header Section */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    marginBottom: isMobile ? '24px' : '44px', 
                    alignItems: 'center',
                    gap: isMobile ? '20px' : '0px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', width: isMobile ? '100%' : 'auto', flex: isMobile ? 'none' : '1' }}>
                        <div style={{ 
                            width: isMobile ? '90px' : '150px', 
                            height: isMobile ? '90px' : '150px', 
                            borderRadius: '50%', 
                            background: '#efefef', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justify: 'center', 
                            border: '1px solid #dbdbdb', 
                            overflow: 'hidden' 
                        }}>
                            {userData.profilePictureUrl ? <img src={userData.profilePictureUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="dp"/> : "👤"}
                        </div>
                    </div>
                    
                    <div style={{ flex: '2', paddingLeft: isMobile ? '0px' : '20px', width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: 'center', 
                            gap: '15px', 
                            marginBottom: '20px',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            <h2 style={{ fontWeight: '300', fontSize: '26px', margin: 0 }}>{userData.username}</h2>
                            {!isOwnProfile ? (
                                <button onClick={handleFollowToggle} style={{ padding: '6px 30px', fontWeight: '600', borderRadius: '4px', border: userData.isFollowed ? '1px solid #dbdbdb' : 'none', background: userData.isFollowed ? '#efefef' : '#0095f6', color: userData.isFollowed ? 'black' : 'white', cursor: 'pointer', width: isMobile ? '80%' : 'auto' }}>
                                    {userData.isFollowed ? 'Following' : 'Follow'}
                                </button>
                            ) : (
                                <button onClick={() => navigate('/edit-profile')} style={{ padding: '6px 20px', fontWeight: '600', borderRadius: '4px', border: '1px solid #dbdbdb', background: 'transparent', cursor: 'pointer', width: isMobile ? '80%' : 'auto' }}>Edit Profile</button>
                            )}
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: isMobile ? 'space-around' : 'flex-start', 
                            gap: isMobile ? '0px' : '40px', 
                            marginBottom: '20px',
                            fontSize: isMobile ? '14px' : '16px',
                            borderTop: isMobile ? '1px solid #efefef' : 'none',
                            borderBottom: isMobile ? '1px solid #efefef' : 'none',
                            padding: isMobile ? '10px 0' : '0'
                        }}>
                            <span><b>{userData.postsCount || 0}</b> posts</span>
                            <span><b>{userData.followersCount || 0}</b> followers</span>
                            <span><b>{userData.followingCount || 0}</b> following</span>
                        </div>
                        
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{userData.fullName}</div>
                        <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap', fontSize: '14px' }}>{userData.bio}</p>
                    </div>
                </div>

                {/* Posts Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: isMobile ? '3px' : '28px', 
                    borderTop: isMobile ? 'none' : '1px solid #dbdbdb', 
                    paddingTop: '20px' 
                }}>
                    {userData.posts && userData.posts.map(post => (
                        <div key={post.id} style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', background: '#efefef', cursor: 'pointer' }}
                            onClick={() => { setSelectedPost(post); setIsPostModalOpen(true); }}>
                            <img src={post.imageUrl} alt="post" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL RESPONSIVE --- */}
            {isPostModalOpen && selectedPost && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2100, backdropFilter: 'blur(4px)', padding: isMobile ? '10px' : '0' }}
                    onClick={() => { setIsPostModalOpen(false); setSelectedPost(null); }}>
                    
                    <div style={{ 
                        background: 'white', 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        width: '100%', 
                        maxWidth: '900px', 
                        height: isMobile ? '90vh' : '85vh', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        
                        {/* Image View */}
                        <div style={{ flex: isMobile ? '1' : '1.5', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                             onDoubleClick={() => handleModalDoubleTap(selectedPost.id)}>
                            <img src={selectedPost.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="post"/>
                            <AnimatePresence>
                                {showBigHeart === selectedPost.id && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} style={{ position: 'absolute', fontSize: '80px', color: '#ed4956' }}>❤️</motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions & Comments View */}
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', height: isMobile ? '50%' : '100%' }}>
                            <div style={{ padding: '14px', borderBottom: '1px solid #efefef', fontWeight: 'bold' }}>{userData.username}</div>
                            
                            <div style={{ flex: '1', padding: '16px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                {selectedPost.comments?.map(comment => (
                                    <div key={comment.id} style={{ marginBottom: '12px', fontSize: '13px' }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{comment.user?.username}</span>
                                        <span>{comment.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '14px', borderTop: '1px solid #efefef', backgroundColor: '#fff' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '22px' }}>
                                    <span style={{ cursor: 'pointer', color: likedPosts.has(selectedPost.id) ? '#ed4956' : 'black' }} 
                                          onClick={() => handleModalLikeToggle(selectedPost.id)}>
                                        {likedPosts.has(selectedPost.id) ? '❤️' : '🤍'}
                                    </span>
                                    <span>💬</span>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>{selectedPost.likesCount || 0} likes</div>
                                
                                <div style={{ display: 'flex', borderTop: '1px solid #efefef', marginTop: '10px', paddingTop: '10px' }}>
                                    <input type="text" placeholder="Add a comment..." value={modalComment} onChange={(e) => setModalComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddModalComment(selectedPost.id)} style={{ border: 'none', width: '100%', outline: 'none', fontSize: '14px' }}/>
                                    <button onClick={() => handleAddModalComment(selectedPost.id)} style={{ border: 'none', background: 'none', color: '#0095f6', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;