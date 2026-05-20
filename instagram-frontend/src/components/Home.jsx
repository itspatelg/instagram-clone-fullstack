import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import StoryBar from '../components/StoryBar';
import StoryViewer from '../components/StoryViewer';
import { ThemeContext } from '../context/ThemeContext'; // Context import kiya

// --- SKELETON COMPONENT (Variables ke saath) ---
const SkeletonPost = () => (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', marginBottom: '25px', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
            <div className="skeleton-blink" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
            <div className="skeleton-blink" style={{ width: '100px', height: '15px', marginLeft: '10px' }}></div>
        </div>
        <div className="skeleton-blink" style={{ width: '100%', height: '400px' }}></div>
        <style>{`
            .skeleton-blink {
                background: var(--border-color);
                background: linear-gradient(110deg, var(--border-color) 8%, var(--bg-color) 18%, var(--border-color) 33%);
                background-size: 200% 100%;
                animation: shine 1.5s linear infinite;
            }
            @keyframes shine { to { background-position-x: -200%; } }
        `}</style>
    </div>
);

const Home = () => {
    const { isDarkMode } = useContext(ThemeContext); // Theme state access kiya
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadingStory, setIsUploadingStory] = useState(false);
    const [activeStory, setActiveStory] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [showBigHeart, setShowBigHeart] = useState(null);

    // --- PAGINATION STATES ---
    const [page, setPage] = useState(0); 
    const [hasMore, setHasMore] = useState(true); 
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fileInputRef = useRef(null);
    const userEmail = localStorage.getItem('userEmail'); 

    // --- FETCH DATA ---
    const fetchPosts = async (pageNum = 0) => {
        if (pageNum === 0) setIsLoading(true);
        else setIsFetchingMore(true);
        try {
            const res = await axios.get(`https://instagram-clone-fullstack-production.up.railway.app/api/posts/feed`, {
                params: { email: userEmail, page: pageNum, size: 5 }
            });
            const newPosts = res.data.posts;
            setPosts(prev => pageNum === 0 ? newPosts : [...prev, ...newPosts]);
            setHasMore(!res.data.isLast);
        } catch (err) { console.error("Fetch error:", err); }
        finally { setIsLoading(false); setIsFetchingMore(false); }
    };

    const fetchStories = async () => {
        try {
            const res = await axios.get(`https://instagram-clone-fullstack-production.up.railway.app/api/stories/active`);
            setStories(res.data);
        } catch (err) { console.error("Stories error:", err); }
    };

    useEffect(() => {
        if (userEmail) {
            fetchPosts(0);
            fetchStories();
        }
    }, [userEmail]);

    // --- SCROLL LOGIC ---
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight) {
                if (hasMore && !isFetchingMore && !isLoading) setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetchingMore, isLoading]);

    useEffect(() => {
        if (page > 0) fetchPosts(page);
    }, [page]);

    // --- ACTIONS ---
    const handleAddStoryClick = () => fileInputRef.current.click();

    const handleStoryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploadingStory(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', userEmail);
        try {
            await axios.post('https://instagram-clone-fullstack-production.up.railway.app/api/stories/upload', formData);
            await fetchStories();
            alert("Story upload ho gayi bhai! 🚀");
        } catch (err) { alert("Story upload nahi ho payi!"); }
        finally { setIsUploadingStory(false); e.target.value = null; }
    };

    const handleToggleLike = async (postId) => {
        const currentlyLiked = likedPosts.has(postId);
        if (!currentlyLiked) {
            setShowBigHeart(postId);
            setTimeout(() => setShowBigHeart(null), 1000);
        }
        try {
            await axios.post(`https://instagram-clone-fullstack-production.up.railway.app/api/posts/${postId}/toggle-like`, { isLiked: currentlyLiked, email: userEmail });
            const newLikedPosts = new Set(likedPosts);
            currentlyLiked ? newLikedPosts.delete(postId) : newLikedPosts.add(postId);
            setLikedPosts(newLikedPosts);
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: currentlyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1 } : p));
        } catch (err) { console.error("Like error:", err); }
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || text.trim() === "") return;
        try {
            await axios.post('https://instagram-clone-fullstack-production.up.railway.app/api/comments/add', { postId, text, email: userEmail });
            setCommentInputs({ ...commentInputs, [postId]: "" });
            const res = await axios.get(`https://instagram-clone-fullstack-production.up.railway.app/api/posts/feed?email=${userEmail}&page=0&size=${(page + 1) * 5}`);
            setPosts(res.data.posts);
        } catch (err) { console.error("Comment error:", err); }
    };

    return (
    <div
    className="home-container"
    style={{
        backgroundColor: 'var(--bg-color)',
        minHeight: '100vh',

        margin:
    window.innerWidth <= 768
        ? '0 0 0 -230px'
        : '0 auto',

        color: 'var(--text-color)',

        transition: '0.3s'
    }}


    >

          <div className="container-fluid">

    <div className="row justify-content-center">

        <div className="col-12 col-md-10 col-lg-7 p-2 p-md-4">

            
                <StoryBar stories={stories} onStoryClick={(story) => setActiveStory(story)} onAddStory={handleAddStoryClick} />
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleStoryUpload} accept="image/*" />

                <AnimatePresence>
                    {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
                </AnimatePresence>

                {isLoading ? (
                    [1, 2, 3].map(n => <SkeletonPost key={n} />)
                ) : (
                    <>
                        {posts.map(post => (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={post.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', marginBottom: '25px', borderRadius: '8px' }}>
                                {/* Header */}
                                <div style={{ padding: '12px', display: 'flex', justifyContent: window.innerWidth <= 768
    ? 'flex-start'
    : 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold', cursor: 'pointer', marginRight: '8px', color: 'var(--text-color)' }}>{post.user?.username}</div>
                                        {post.user?.email !== userEmail && (
                                            <button onClick={() => handleFollowToggle(post.user.username)} style={{ background: 'none', border: 'none', color: post.followedByCurrentUser ? 'var(--secondary-text)' : '#0095f6', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', padding: '0' }}>
                                                • {post.followedByCurrentUser ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>
                                    <span style={{ fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-color)' }}>•••</span>
                                </div>

                                {/* Image Section */}
                                <div style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }} onDoubleClick={() => handleToggleLike(post.id)}>
                                    <img src={post.imageUrl} alt="post" style={{ width: '100%', display: 'block' }} />
                                    <AnimatePresence>
                                        {showBigHeart === post.id && (
                                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} style={{ position: 'absolute', top: '40%', left: '42%', fontSize: '80px', zIndex: 10, pointerEvents: 'none' }}>❤️</motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Actions & Content */}
                                <div style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                                        <motion.span key={likedPosts.has(post.id) ? 'liked' : 'unliked'} whileTap={{ scale: 1.4 }} onClick={() => handleToggleLike(post.id)} style={{ cursor: 'pointer', fontSize: '24px', color: likedPosts.has(post.id) ? '#ed4956' : 'var(--text-color)' }}>
                                            {likedPosts.has(post.id) ? '❤️' : '🤍'}
                                        </motion.span>
                                        <span style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--text-color)' }}>💬</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-color)' }}>{post.likesCount || 0} likes</div>
                                    <div style={{ marginBottom: '10px', color: 'var(--text-color)' }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{post.user?.username}</span>
                                        {post.caption}
                                    </div>

                                    {/* Comments */}
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                        {post.comments?.map((comment, idx) => (
                                            <motion.div key={comment.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} style={{ marginBottom: '5px', fontSize: '14px', color: 'var(--text-color)' }}>
                                                <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{comment.user?.username}</span>
                                                {comment.text}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Comment Input */}
                                    <div style={{ marginTop: '10px', display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                        <input type="text" placeholder="Add a comment..." value={commentInputs[post.id] || ""} onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)} style={{ border: 'none', width: '100%', outline: 'none', fontSize: '14px', background: 'transparent', color: 'var(--text-color)' }} />
                                        <button onClick={() => handleAddComment(post.id)} style={{ border: 'none', background: 'none', color: '#0095f6', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {isFetchingMore && <div style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold', color: 'var(--secondary-text)' }}>Loading more posts...</div>}
                        {!hasMore && posts.length > 0 && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--secondary-text)' }}>No more posts to show. 🎉</div>}
                    </>
                )}
            </div>
        </div>
     </div>
 </div>
    );
};

export default Home;