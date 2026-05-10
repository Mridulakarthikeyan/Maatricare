import React from 'react';
import { ActivitySquare, Battery, HeartPulse } from 'lucide-react';

export default function Wellness() {
  const [exercises, setExercises] = React.useState([]);
  const [activeTimer, setActiveTimer] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [mentalState, setMentalState] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/wellness')
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error(err));
  }, []);

  React.useEffect(() => {
    let timer;
    if (activeTimer && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeTimer) {
      alert("Routine Complete! Great job 🌸");
      setActiveTimer(null);
    }
    return () => clearInterval(timer);
  }, [activeTimer, timeLeft]);

  const startRoutine = (ex) => {
    const min = parseInt(ex.duration.split(' ')[0]) || 5;
    setTimeLeft(min * 60);
    setActiveTimer(ex);
  };

  const logMentalState = (state) => {
    setMentalState(state);
    if(state === 'Need Support') alert("We hear you. Please utilize the SOS button if you need immediate consultation, or contact a loved one. 💕");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Exercise & Wellness</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', fontSize: '1.1rem' }}>Safe routines to keep you active and relaxed.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {exercises.map((ex, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{ex.title}</h3>
             <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
               <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.6)', padding: '4px 8px', borderRadius: '4px' }}>{ex.duration}</span>
               <span style={{ fontSize: '13px', background: 'rgba(255,77,166,0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px' }}>{ex.level}</span>
             </div>
             <p style={{ color: 'var(--text-light)', lineHeight: 1.5 }}>{ex.desc}</p>
             <button style={{ 
               marginTop: '16px', background: 'transparent', border: '1px solid var(--primary)', 
               color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
               width: '100%', fontWeight: 600
             }} onClick={() => startRoutine(ex)}>
               {activeTimer && activeTimer.title === ex.title ? `In Progress...` : `Start Routine`}
             </button>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ marginTop: '32px', padding: '32px', background: 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(255, 77, 166, 0.1))' }}>
         <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
           <HeartPulse color="#e94a5a" /> Mental Health Check-In
         </h2>
         <p style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>How are you feeling today? Your mental wellbeing is just as important as your physical health.</p>
         
         {mentalState ? (
           <div style={{ background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '12px', fontWeight: 600, color: 'var(--primary)' }}>
             You logged your status as: {mentalState}. Remember to take it easy today! 🌸
           </div>
         ) : (
           <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" style={{ flex: 1, background: '#4cd137', boxShadow: 'none' }} onClick={()=>logMentalState('Great')}>Great 🌟</button>
              <button className="btn-primary" style={{ flex: 1, background: '#fbc531', color: '#333', boxShadow: 'none' }} onClick={()=>logMentalState('Okay')}>Okay 😐</button>
              <button className="btn-primary" style={{ flex: 1, background: '#e84118', boxShadow: 'none' }} onClick={()=>logMentalState('Need Support')}>Need Support 💖</button>
           </div>
         )}
      </div>

      {/* Timer Modal */}
      {activeTimer && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '40px', textAlign: 'center', width: '300px' }}>
            <h2 style={{ marginBottom: '8px' }}>{activeTimer.title}</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Breath in, breath out...</p>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '24px' }}>
              {formatTime(timeLeft)}
            </div>
            <button className="btn-primary" onClick={() => setActiveTimer(null)} style={{ background: '#ccc', color: '#333', boxShadow: 'none' }}>Stop</button>
          </div>
        </div>
      )}
    </div>
  );
}
