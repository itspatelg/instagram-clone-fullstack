import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const AIChat = () => {
    const [messages, setMessages] = useState([{ text: "Bhai main AnkAI hoon, bata kya help karun?", isAI: true }]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { isDarkMode } = useContext(ThemeContext);
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, isAI: false };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await axios.post('http://localhost:8080/api/ai/ask', { prompt: input });
            setMessages(prev => [...prev, { text: res.data.answer, isAI: true }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Network locha ho gaya bhai!", isAI: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ marginLeft: '240px', padding: '20px', backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-color)' }}>
            <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>AnkAI Assistant ✨</h2>
            
            <div style={{ height: '75vh', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.isAI ? 'flex-start' : 'flex-end',
                        backgroundColor: m.isAI ? 'var(--border-color)' : '#0095f6',
                        color: m.isAI ? 'var(--text-color)' : 'white',
                        padding: '10px 15px',
                        borderRadius: '15px',
                        maxWidth: '70%',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {m.text}
                    </div>
                ))}
                {isTyping && <p style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>AI is thinking...</p>}
                <div ref={scrollRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
                <button onClick={handleSend} style={{ backgroundColor: '#0095f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Ask</button>
            </div>
        </div>
    );
};

export default AIChat;