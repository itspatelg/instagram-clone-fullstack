import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userEmail = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');

    // Purana data fetch karne ke liye (Optional but good)
    useEffect(() => {
        const fetchCurrentData = async () => {
            const res = await axios.get(`http://https://instagram-clone-fullstack-production.up.railway.app/api/users/profile?username=${username}&currentUserEmail=${userEmail}`);
            setFullName(res.data.fullName || "");
            setBio(res.data.bio || "");
        };
        fetchCurrentData();
    }, [username, userEmail]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        let profilePictureUrl = null;

        try {
            // 1. Agar nayi image select ki hai toh Cloudinary pe bhejo
            if (image) {
                const data = new FormData();
                data.append("file", image);
                data.append("upload_preset", "insta_clone"); // Tera preset name
                const res = await axios.post(`https://api.cloudinary.com/v1_1/dsh8k1wn3/image/upload`, data);
                profilePictureUrl = res.data.secure_url;
            }

            // 2. Backend update call
            await axios.post('http://https://instagram-clone-fullstack-production.up.railway.app/api/users/update', {
                email: userEmail,
                fullName,
                bio,
                profilePictureUrl
            });

            alert("Profile Updated!");
            navigate(`/profile/${username}`);
        } catch (err) {
            console.error(err);
            alert("Update fail ho gaya!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingLeft: '240px', paddingTop: '50px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', border: '1px solid #dbdbdb', padding: '40px', borderRadius: '4px' }}>
                <h2 style={{ marginBottom: '30px', fontWeight: '300' }}>Edit Profile</h2>
                
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Profile Photo</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #dbdbdb', borderRadius: '3px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #dbdbdb', borderRadius: '3px', height: '80px' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ background: '#0095f6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {loading ? "Updating..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;