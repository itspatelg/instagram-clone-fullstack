import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [connected, setConnected] = useState(false); // Connection track karne ke liye
    const stompClient = useRef(null);
    
    const currentUserEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (!currentUserEmail) return;

        const connectWebSocket = () => {
            const socket = new SockJS('http://https://instagram-clone-fullstack-production.up.railway.app/ws-chat');
            const client = Stomp.over(socket);
            client.debug = null; // Console saaf rakhne ke liye

            client.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClient.current = client;
                setConnected(true);

                // Subscribe only AFTER connection
                client.subscribe(`/user/${currentUserEmail}/queue/messages`, (payload) => {
                    const newMessage = JSON.parse(payload.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            }, (error) => {
                console.error('STOMP error:', error);
                setConnected(false);
                // 5 second baad reconnect karne ki koshish karega
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
            axios.get(`http://https://instagram-clone-fullstack-production.up.railway.app/api/messages/history?user1=${currentUserEmail}&user2=${selectedUser.email}`)
                .then(res => setMessages(res.data))
                .catch(err => console.error("History fetch error:", err));
        }
    }, [selectedUser, currentUserEmail]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://https://instagram-clone-fullstack-production.up.railway.app/api/users/all');
            setUserData(res.data.filter(u => u.email !== currentUserEmail));
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const sendMessage = () => {
        // Strict Check: Client hona chahiye, connected hona chahiye, aur user select hona chahiye
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
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fff', marginLeft: '220px' }}>
            <div style={{ width: '350px', borderRight: '1px solid #dbdbdb', overflowY: 'auto' }}>
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
                            backgroundColor: selectedUser?.id === user.id ? '#efefef' : 'transparent' 
                        }}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#dbdbdb', marginRight: '12px' }}></div>
                        <div>
                            <div style={{ fontWeight: '600' }}>{user.username}</div>
                            <div style={{ fontSize: '12px', color: '#8e8e8e' }}>{user.email}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <div style={{ padding: '15px 20px', borderBottom: '1px solid #dbdbdb', fontWeight: 'bold' }}>
                            {selectedUser.username}
                        </div>
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
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
                                        maxWidth: '60%',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '20px', borderTop: '1px solid #dbdbdb', display: 'flex' }}>
                            <input 
                                type="text" 
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder={connected ? "Message..." : "Connecting..."}
                                disabled={!connected}
                                style={{ flex: 1, padding: '10px 15px', borderRadius: '25px', border: '1px solid #dbdbdb', outline: 'none' }} 
                            />
                            <button 
                                onClick={sendMessage} 
                                disabled={!connected}
                                style={{ marginLeft: '10px', color: connected ? '#0095f6' : '#ccc', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h3>Select a user to start chatting</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;