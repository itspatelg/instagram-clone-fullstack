import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const StoryViewer = ({ story, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // 5 sec baad band
        return () => clearTimeout(timer);
    }, [story, onClose]);

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', 
            justifyContent: 'center', alignItems: 'center' 
        }}>
            <div style={{ width: '100%', maxWidth: '400px', height: '80vh', position: 'relative' }}>
                {/* Progress Bar */}
                <div style={{ position: 'absolute', top: '10px', width: '95%', left: '2.5%', height: '2px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '100%' }} 
                        transition={{ duration: 5, ease: "linear" }} 
                        style={{ height: '100%', background: 'white', borderRadius: '2px' }} 
                    />
                </div>
                
                {/* User Info on Top of Story */}
                <div style={{ position: 'absolute', top: '25px', left: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', zIndex: 10 }}>
                    <img src={story.user?.profilePictureUrl} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid white' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{story.user?.username}</span>
                </div>

                <img src={story.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '15px', color: 'white', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 10 }}>✕</button>
            </div>
        </div>
    );
};

export default StoryViewer;