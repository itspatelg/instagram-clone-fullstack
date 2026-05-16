import React from 'react';
import { motion } from 'framer-motion';

const StoryBar = ({ stories, onStoryClick, onAddStory }) => {
    return (
        <div style={{ 
            display: 'flex', gap: '15px', padding: '15px 10px', 
            overflowX: 'auto', borderBottom: '1px solid #dbdbdb',
            marginBottom: '10px', scrollbarWidth: 'none', backgroundColor: 'white' 
        }}>
            {/* 1. Add Story Button */}
            <div style={{ textAlign: 'center', cursor: 'pointer', minWidth: '70px' }} onClick={onAddStory}>
                <div style={{ 
                    width: '60px', height: '60px', borderRadius: '50%', 
                    border: '2px solid #dbdbdb', padding: '2px', position: 'relative' 
                }}>
                    <div style={{ 
                        width: '100%', height: '100%', borderRadius: '50%', 
                        background: '#efefef', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', fontSize: '24px', color: '#0095f6' 
                    }}>+</div>
                </div>
                <p style={{ fontSize: '12px', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your Story</p>
            </div>

            {/* 2. List of Active Stories */}
            {stories.map((story) => (
                <motion.div 
                    whileTap={{ scale: 0.9 }}
                    key={story.id} 
                    onClick={() => onStoryClick(story)} 
                    style={{ textAlign: 'center', cursor: 'pointer', minWidth: '70px' }}
                >
                    <div style={{ 
                        width: '62px', height: '62px', borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        padding: '2px' 
                    }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid white', overflow: 'hidden' }}>
                            <img 
                                src={story.user?.profilePictureUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt="story-user"
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '12px', marginTop: '5px' }}>{story.user?.username}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StoryBar;