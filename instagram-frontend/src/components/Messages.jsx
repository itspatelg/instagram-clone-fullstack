import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [connected, setConnected] = useState(false); 
    const stompClient = useRef(null);
    
    // Dynamic screen resize listener
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const currentUserEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!currentUserEmail) return;

        const connectWebSocket = () => {
            const socket = new SockJS("https://instagram-clone-fullstack-production.up.railway.app/ws-chat");
            const client = Stomp.over(socket);
            client.debug = null; 

            client.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClient.current = client;
                setConnected(true);

                client.subscribe(`/user/${currentUserEmail}/queue/messages`, (payload) => {
                    const newMessage = JSON.parse(payload.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            }, (error) => {
                console.error('STOMP error:', error);
                setConnected(false);
                setTimeout(connectWebSocket, 5000);
            });
        };

        connectWebSocket();
        fetchUsers();

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [currentUserEmail]);

    useEffect(() => {
        if (selectedUser && currentUserEmail) {
            axios.get(`https://instagram-clone-fullstack-production.up.railway.app/api/messages/history?user1=${currentUserEmail}&user2=${selectedUser.email}`)
                .then(res => setMessages(res.data))
                .catch(err => console.error("History fetch error:", err));
        }
    }, [selectedUser, currentUserEmail]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://instagram-clone-fullstack-production.up.railway.app/api/users/all');
            setUserData(res.data.filter(u => u.email !== currentUserEmail));
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const sendMessage = () => {
        if (connected && stompClient.current && messageInput.trim() && selectedUser) {
            const chatMessage = {
                senderEmail: currentUserEmail,
                receiverEmail: selectedUser.email,
                content: messageInput,
                timestamp: new Date().toISOString()
            };

            try {
                stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                setMessages((prev) => [...prev, chatMessage]);
                setMessageInput("");
            } catch (err) {
                console.error("Send error:", err);
            }
        }
    };

    return (
        <div style={{ 
            display: 'flex',
            height: '100vh',
            backgroundColor: '#fff',
            marginLeft: isMobile ? '0' : '240px',
            paddingTop: isMobile ? '60px' : '0px',
            transition: 'all 0.3s ease'
        }}>
            {/* LEFT USER LIST PANEL */}
            {(!isMobile || !selectedUser) && (
                <div style={{ 
                    width: isMobile ? '100%' : '350px',
                    borderRight: '1px solid #dbdbdb',
                    overflowY: 'auto',
                    height: '100%'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #dbdbdb', fontWeight: 'bold', fontSize: '20px' }}>
                        Messages 
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: connected ? 'green' : 'red' }}>
                            {connected ? '● Online' : '● Connecting...'}
                        </span>
                    </div>
                    {userData.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            style={{ 
                                padding: '15px 20px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                backgroundColor: selectedUser?.id === user.id ? '#efefef' : 'transparent',
                                borderBottom: '1px solid #f7f7f7'
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#dbdbdb', marginRight: '12px', overflow:'hidden' }}>
                                {user.profilePictureUrl ? <img src={user.profilePictureUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="dp"/> : <div style={{padding:'10px'}}>👤</div>}
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>{user.username}</div>
                                <div style={{ fontSize: '12px', color: '#8e8e8e' }}>{user.email}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* RIGHT CHAT WINDOW PANEL */}
            {(!isMobile || selectedUser) && (
                <div style={{ flex: 1, display: selectedUser ? 'flex' : (isMobile ? 'none' : 'flex'), flexDirection: 'column', height: '100%' }}>
                    {selectedUser ? (
                        <>
                            {/* CHAT HEADER */}
                            <div style={{ padding: '15px 20px', borderBottom: '1px solid #dbdbdb', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                {isMobile && (
                                    <button 
                                        onClick={() => setSelectedUser(null)} 
                                        style={{ border: 'none', background: 'none', fontSize: '20px', marginRight: '15px', cursor: 'pointer' }}
                                    >
                                        ⬅️
                                    </button>
                                )}
                                <div>{selectedUser.username}</div>
                            </div>

                            {/* MESSAGES TEXT SCROLL AREA */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        style={{ 
                                            alignSelf: msg.senderEmail === currentUserEmail ? 'flex-end' : 'flex-start',
                                            backgroundColor: msg.senderEmail === currentUserEmail ? '#0095f6' : '#efefef',
                                            color: msg.senderEmail === currentUserEmail ? 'white' : 'black',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            marginBottom: '8px',
                                            maxWidth: '75%',
                                            wordBreak: 'break-word',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                ))}
                            </div>

                            {/* INPUT CHAT FIELD AREA */}
                            <div style={{ padding: isMobile ? '10px 15px' : '20px', borderTop: '1px solid #dbdbdb', display: 'flex', backgroundColor: '#fff' }}>
                                <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder={connected ? "Message..." : "Connecting..."}
                                    disabled={!connected}
                                    style={{ flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #dbdbdb', outline: 'none', fontSize: '14px' }} 
                                />
                                <button 
                                    onClick={sendMessage} 
                                    disabled={!connected}
                                    style={{ marginLeft: '10px', color: connected ? '#0095f6' : '#ccc', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ textAlign: 'center', padding: '20px', color: '#8e8e8e', fontWeight: '300' }}>
                                Select a user to start chatting
                            </h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Messages;