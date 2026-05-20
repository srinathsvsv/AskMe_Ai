import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Bot, Zap, Menu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import API from '../context/api';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Welcome ti AskMe_Ai. How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMessage = { id: Date.now(), text: userText, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await API.post('/chat', {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: userText }]
      });

      const aiText = response.data?.choices?.[0]?.message?.content
        || response.data?.message
        || 'No response from AI';

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: aiText,
        sender: "bot"
      }] );
    } catch (error) {
      console.error('Chat request error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Unable to reach AI server. Please try again.';
      console.error('Error details:', errorMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Error: ${errorMessage}`,
        sender: "bot"
      }] );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-layout animate-fade-in">
      <header className="chat-header">
        <div className="chat-brand">
          <Zap size={24} color="var(--color-accent-primary)" />
          <span>askMe</span>
        </div>
        
        <div className="chat-user-nav">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={() => navigate('/history')} title="History">
              <Menu size={20} />
            </button>
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=eab308&color=09090b"} 
              alt="User Avatar" 
              className="avatar"
              onClick={() => navigate('/profile')}
              title="Profile"
            />
          </div>
        </div>
      </header>

      <main className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className="message-bubble">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-input-area">
        <form className="chat-form" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input"
            placeholder="Transmit command to AI core..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" disabled={!input.trim() || loading}>
            {loading ? 'Sending...' : <Send size={18} style={{ marginLeft: '-2px' }} />}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
