import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // FIX: Key ka naam 'email' hona chahiye kyunki AuthController 'email' dhund raha hai
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email, 
                password: password
            });
            
            // Backend poora user object bhej raha hai, response.data check karo
            if (response.data) {
                // Details save karna zaroori hai
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('username', response.data.username);
                
                alert("Mubarak ho! Login Successful.");
                // window.location se page refresh hoga aur Sidebar/Navbar dikhne lagega
                window.location.href = "/home"; 
            }
        } catch (error) {
            console.error(error);
            // Backend se error message dikhane ke liye
            alert(error.response?.data || "Email ya Password sahi nahi hai!");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fafafa' }}>
            <div style={{ background: 'white', padding: '40px', border: '1px solid #dbdbdb', width: '350px', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'cursive', fontSize: '40px', marginBottom: '20px' }}>Instagram</h1>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle} required
                    />
                    <input 
                        type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle} required
                    />
                    <button type="submit" style={buttonStyle}>Log In</button>
                </form>
                <div style={{ margin: '20px 0', color: '#8e8e8e', fontSize: '12px' }}>OR</div>
                <p style={{ fontSize: '14px' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#0095f6', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #dbdbdb', borderRadius: '3px', backgroundColor: '#fafafa', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '10px', background: '#0095f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };

export default Login;