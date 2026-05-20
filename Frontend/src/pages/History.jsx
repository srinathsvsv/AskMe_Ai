import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();

  // Mock data for history
  const historySessions = [
    { id: 1, title: 'Database Optimization Strategies', date: '2026-05-05', time: '14:30', preview: 'Analyzing the query plan for...' },
    { id: 2, title: 'UI Component Architecture', date: '2026-05-04', time: '09:15', preview: 'Let\'s set up the React context for...' },
    { id: 3, title: 'Cyberpunk Theme Generation', date: '2026-05-03', time: '18:45', preview: 'I need a color palette using...' },
    { id: 4, title: 'Initial System Boot', date: '2026-05-01', time: '10:00', preview: 'Hello, askMe AI online...' }
  ];

  return (
    <div className="app-container" style={{ padding: '2rem' }}>
      <button 
        className="btn btn-outline" 
        style={{ marginBottom: '2rem' }}
        onClick={() => navigate('/chat')}
      >
        <ArrowLeft size={18} /> Back to Terminal
      </button>

      <div className="history-container animate-fade-in" style={{ margin: '0 auto', width: '100%' }}>
        <h2 className="history-title">Operation Logs</h2>
        
        <div className="history-list">
          {historySessions.map(session => (
            <div key={session.id} className="history-item" onClick={() => navigate('/chat')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '0.5rem', color: 'var(--color-accent-primary)' }}>
                  <MessageSquare size={20} />
                </div>
                <div className="history-info">
                  <h3>{session.title}</h3>
                  <div className="history-meta">
                    <span>{session.date}</span>
                    <span>{session.time}</span>
                    <span style={{ fontStyle: 'italic', opacity: 0.8 }}>"{session.preview}"</span>
                  </div>
                </div>
              </div>
              <ChevronRight color="var(--color-text-secondary)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
