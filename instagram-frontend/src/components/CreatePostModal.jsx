import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePostModal = ({ isOpen, onClose }) => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const userEmail = localStorage.getItem('userEmail'); 

    // Image preview logic
    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return alert("Bhai photo toh select kar lo!");
        if (!userEmail) return alert("Session expired! Login phir se karo.");

        setLoading(true);

        // --- AB HUM DIRECT BACKEND PAR FILE BHEJENGE ---
        const formData = new FormData();
        formData.append("file", image);      // Backend RequestParam "file" se match karega
        formData.append("caption", caption); // Backend RequestParam "caption" se match karega
        formData.append("email", userEmail); // Backend RequestParam "email" se match karega

        try {
            // Seedha apne Java Backend (8080) ko call karo
            const response = await axios.post('http://https://instagram-clone-fullstack-production.up.railway.app/api/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert("Post makkhan ki tarah upload ho gayi! 🚀");
                setCaption("");
                setImage(null);
                onClose(); 
                window.location.reload(); 
            }
        } catch (err) {
            console.error("Upload error details:", err.response?.data || err.message);
            alert("Fail ho gaya! IntelliJ ke console mein check karo kya error hai.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white', padding: '0', borderRadius: '12px',
                width: '450px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #dbdbdb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                    <h4 style={{ margin: 0 }}>Create New Post</h4>
                    <button 
                        onClick={handleUpload} 
                        disabled={loading || !image}
                        style={{ border: 'none', background: 'none', color: '#0095f6', fontWeight: 'bold', cursor: 'pointer', opacity: (loading || !image) ? 0.5 : 1 }}
                    >
                        {loading ? "Sharing..." : "Share"}
                    </button>
                </div>
                
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    {!preview ? (
                        <div style={{ padding: '40px 0' }}>
                            <label style={{ cursor: 'pointer', padding: '10px 20px', background: '#0095f6', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                                Select from Computer
                                <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                        </div>
                    ) : (
                        <div>
                            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', marginBottom: '15px' }} />
                            <button onClick={() => setImage(null)} style={{ color: '#ed4956', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Change Photo</button>
                        </div>
                    )}

                    <textarea 
                        placeholder="Caption likho..." 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        style={{ width: '100%', padding: '12px', height: '80px', borderRadius: '8px', border: '1px solid #dbdbdb', marginTop: '15px', resize: 'none', boxSizing: 'border-box' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;