import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, AlertCircle, PhoneCall, Send, UserRound, Bot } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState('User');
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [weight, setWeight] = useState('');
  const [risk, setRisk] = useState({ text: 'Enter your health data to see risk analysis.', type: 'info' });
  
  const [chatMsgs, setChatMsgs] = useState([{ sender: 'bot', text: 'Hi! I\'m your MaatriCare assistant. Ask me anything about your pregnancy. 💕' }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('maatriCareUser');
    if (!storedUser) navigate('/login');
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  const handleRecordData = async () => {
    if (!bp || !sugar || !weight) {
      alert("Please fill all fields ❌");
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, bp, sugar, weight })
      });
      const data = await res.json();
      
      let type = 'info';
      if (data.risk.includes('High')) type = 'danger';
      else if (data.risk.includes('Moderate')) type = 'warning';
      else if (data.risk.includes('safe')) type = 'success';
      
      setRisk({ text: data.risk || 'Data Recorded ✅', type });
    } catch (err) {
      alert("Error saving data. Is the backend running?");
    }
  };

  const handleSendMsg = async () => {
    if (!chatInput.trim()) return;
    
    const newMsg = { sender: 'user', text: chatInput };
    setChatMsgs(prev => [...prev, newMsg]);
    setChatInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg.text })
      });
      const data = await res.json();
      setChatMsgs(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setChatMsgs(prev => [...prev, { sender: 'bot', text: 'Sorry, I am offline right now. 💤' }]);
    }
  };

  const logout = () => {
    localStorage.removeItem('maatriCareUser');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', background: 'var(--bg-gradient-start)' }}>
      {/* Rendered inside Layout */}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '32px', color: 'var(--text-dark)' }}>Your Health Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 1.5fr)', gap: '32px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}><Activity color="var(--primary)" /> Health Input</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label>Blood Pressure (mmHg)</label>
                  <input type="number" placeholder="120" value={bp} onChange={e=>setBp(e.target.value)} />
                </div>
                <div>
                  <label>Sugar Level (mg/dL)</label>
                  <input type="number" placeholder="100" value={sugar} onChange={e=>setSugar(e.target.value)} />
                </div>
                <div>
                  <label>Weight (kg)</label>
                  <input type="number" placeholder="65" value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
                
                <button className="btn-primary" onClick={handleRecordData} style={{ marginTop: '16px' }}>Record Data</button>
              </div>
            </div>

            <div className={`glass-panel risk-${risk.type}`} style={{ padding: '32px', border: risk.type === 'danger' ? '2px solid #ff4d4d' : risk.type === 'warning' ? '2px solid #ffa64d' : '1px solid var(--glass-border)' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><AlertCircle color={risk.type === 'danger' ? '#ff4d4d' : "var(--text-dark)"} /> Risk Analysis</h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, color: risk.type === 'danger' ? '#ff4d4d' : 'var(--text-dark)' }}>{risk.text}</p>
            </div>
            
            <button className="sos-btn" style={{ 
              padding: '24px', borderRadius: '24px', color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontSize: '1.2rem', fontWeight: 700
            }} onClick={() => { alert("🚨 Emergency! Calling ambulance..."); window.location.href="tel:108"; }}>
              <PhoneCall fill="white" /> SOS Emergency
            </button>
          </div>

          {/* Right Column (Chatbot) */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
             <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>💬 AI Assistant</h2>
             
             <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
               {chatMsgs.map((msg, i) => (
                 <div key={i} className={`chat-message ${msg.sender === 'user' ? 'chat-user' : 'chat-bot'}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {msg.sender === 'bot' ? <Bot size={20} style={{ marginTop: '2px', flexShrink: 0 }} /> : null}
                    <div>{msg.text}</div>
                    {msg.sender === 'user' ? <UserRound size={20} style={{ marginTop: '2px', flexShrink: 0 }} /> : null}
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>

             <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Ask about your pregnancy..." 
                  value={chatInput} 
                  onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
                  style={{ flex: 1 }}
                />
                <button onClick={handleSendMsg} className="btn-primary" style={{ padding: '12px', borderRadius: '16px' }}>
                  <Send size={20} />
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
