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
    
    // --- YE STATE FIX KAREGI LIKE COUNT ---
    const [likedPosts, setLikedPosts] = useState(new Set()); 
    const currentUserEmail = localStorage.getItem('userEmail');

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

    // --- FIXED LIKE TOGGLE LOGIC ---
    const handleModalLikeToggle = async (postId) => {
        const isCurrentlyLiked = likedPosts.has(postId);
        
        try {
            // Backend ko sahi status bhejo
            const res = await axios.post(`https://instagram-clone-fullstack-production.up.railway.app/api/posts/${postId}/toggle-like`, { 
                email: currentUserEmail,
                isLiked: isCurrentlyLiked // TRUE jayega agar pehle se liked hai
            });

            // Local state update karo
            const newLikedPosts = new Set(likedPosts);
            if (isCurrentlyLiked) {
                newLikedPosts.delete(postId);
            } else {
                newLikedPosts.add(postId);
            }
            setLikedPosts(newLikedPosts);

            // UI Refresh
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
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', marginLeft: '240px' }}>
            <div style={{ maxWidth: '935px', margin: '0 auto', padding: '30px 20px' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', marginBottom: '44px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dbdbdb', overflow: 'hidden' }}>
                            {userData.profilePictureUrl ? <img src={userData.profilePictureUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="dp"/> : "👤"}
                        </div>
                    </div>
                    <div style={{ flex: 2, paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <h2 style={{ fontWeight: '300', fontSize: '28px', margin: 0 }}>{userData.username}</h2>
                            {!isOwnProfile ? (
                                <button onClick={handleFollowToggle} style={{ padding: '5px 24px', fontWeight: '600', borderRadius: '4px', border: userData.isFollowed ? '1px solid #dbdbdb' : 'none', background: userData.isFollowed ? '#efefef' : '#0095f6', color: userData.isFollowed ? 'black' : 'white', cursor: 'pointer' }}>
                                    {userData.isFollowed ? 'Following' : 'Follow'}
                                </button>
                            ) : (
                                <button onClick={() => navigate('/edit-profile')} style={{ padding: '5px 15px', fontWeight: '600', borderRadius: '4px', border: '1px solid #dbdbdb', background: 'transparent', cursor: 'pointer' }}>Edit Profile</button>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
                            <span><b>{userData.postsCount || 0}</b> posts</span>
                            <span><b>{userData.followersCount || 0}</b> followers</span>
                            <span><b>{userData.followingCount || 0}</b> following</span>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{userData.fullName}</div>
                        <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{userData.bio}</p>
                    </div>
                </div>

                {/* Posts Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', borderTop: '1px solid #dbdbdb', paddingTop: '20px' }}>
                    {userData.posts && userData.posts.map(post => (
                        <div key={post.id} style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', background: '#efefef', cursor: 'pointer' }}
                            onClick={() => { setSelectedPost(post); setIsPostModalOpen(true); }}>
                            <img src={post.imageUrl} alt="post" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL --- */}
            {isPostModalOpen && selectedPost && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }}
                    onClick={() => { setIsPostModalOpen(false); setSelectedPost(null); }}>
                    
                    <div style={{ background: 'white', display: 'flex', width: '90%', maxWidth: '900px', height: '85vh', borderRadius: '4px', overflow: 'hidden' }}
                        onClick={(e) => e.stopPropagation()}>
                        
                        <div style={{ flex: '1.5', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                             onDoubleClick={() => handleModalDoubleTap(selectedPost.id)}>
                            <img src={selectedPost.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="post"/>
                            <AnimatePresence>
                                {showBigHeart === selectedPost.id && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} style={{ position: 'absolute', fontSize: '80px', color: '#ed4956' }}>❤️</motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '14px', borderBottom: '1px solid #efefef', fontWeight: 'bold' }}>{userData.username}</div>
                            
                            <div style={{ flex: '1', padding: '16px', overflowY: 'auto' }}>
                                {/* Caption & Comments list loop... */}
                                {selectedPost.comments?.map(comment => (
                                    <div key={comment.id} style={{ marginBottom: '12px' }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{comment.user?.username}</span>
                                        <span style={{ fontSize: '14px' }}>{comment.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* --- FIXED ACTION AREA --- */}
                            <div style={{ padding: '14px', borderTop: '1px solid #efefef' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '24px' }}>
                                    <span style={{ cursor: 'pointer', color: likedPosts.has(selectedPost.id) ? '#ed4956' : 'black' }} 
                                          onClick={() => handleModalLikeToggle(selectedPost.id)}>
                                        {likedPosts.has(selectedPost.id) ? '❤️' : '🤍'}
                                    </span>
                                    <span>💬</span>
                                    <span>✈️</span>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{selectedPost.likesCount || 0} likes</div>
                                
                                <div style={{ display: 'flex', borderTop: '1px solid #efefef', marginTop: '10px', paddingTop: '10px' }}>
                                    <input type="text" placeholder="Add a comment..." value={modalComment} onChange={(e) => setModalComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddModalComment(selectedPost.id)} style={{ border: 'none', width: '100%', outline: 'none' }}/>
                                    <button onClick={() => handleAddModalComment(selectedPost.id)} style={{ border: 'none', background: 'none', color: '#0095f6', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
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