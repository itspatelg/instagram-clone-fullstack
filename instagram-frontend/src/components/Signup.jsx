import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        console.log("Koshish kar raha hoon data bhejne ki:", formData);

        try {

            const response = await API.post(
                "/api/auth/signup",
                formData
            );

            console.log("Backend ka Jawab:", response.data);

            alert("Registration Successful! Mast kaam ho gaya.");

            navigate('/login');

        } catch (error) {

            console.error(
                "Asli Error ye hai:",
                error.response ? error.response.data : error.message
            );

            if (error.response && error.response.status === 403) {

                alert("Signup Failed: Security Block (CORS ya CSRF issue).");

            } else {

                alert("Signup Failed! Shayad ye Username/Email pehle se hai ya Backend band hai.");

            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#fafafa',
                fontFamily: 'sans-serif'
            }}
        >

            <div
                style={{
                    background: 'white',
                    padding: '40px',
                    border: '1px solid #dbdbdb',
                    width: '350px',
                    textAlign: 'center'
                }}
            >

                <h1
                    style={{
                        fontSize: '40px',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        fontFamily: 'cursive'
                    }}
                >
                    Instagram
                </h1>

                <p
                    style={{
                        color: '#8e8e8e',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginBottom: '20px'
                    }}
                >
                    Sign up to see photos and videos from your friends.
                </p>

                <form
                    onSubmit={handleSignup}
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Sign Up
                    </button>

                </form>

                <p
                    style={{
                        fontSize: '12px',
                        color: '#8e8e8e',
                        marginTop: '10px'
                    }}
                >
                    By signing up, you agree to our Terms, Data Policy and Cookies Policy.
                </p>

                <div
                    style={{
                        borderTop: '1px solid #dbdbdb',
                        marginTop: '20px',
                        paddingTop: '20px'
                    }}
                >

                    <p style={{ fontSize: '14px' }}>
                        Have an account?

                        <span
                            onClick={() => navigate('/login')}
                            style={{
                                color: '#0095f6',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {' '}Log in
                        </span>

                    </p>

                </div>

            </div>

        </div>
    );
};

const inputStyle = {
    margin: '5px 0',
    padding: '10px',
    background: '#fafafa',
    border: '1px solid #dbdbdb',
    borderRadius: '3px',
    fontSize: '12px'
};

const buttonStyle = {
    margin: '15px 0',
    padding: '10px',
    background: '#0095f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

export default Signup;