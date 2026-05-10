import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('maatriCareUser', data.user || email.split('@')[0]);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-screen flex-center container">
      <Link to="/" style={{ position: 'absolute', top: 30, left: 30, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
        <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }}/> Back Home
      </Link>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <Heart color="var(--primary)" fill="var(--primary)" size={48} style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Sign in to continue your journey 🌸</p>

        {error && (
           <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
             {error}
           </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          
          <div>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-light)" style={{ position: 'absolute', top: '16px', left: '16px' }}/>
              <input 
                type="email" 
                placeholder="you@example.com" 
                style={{ paddingLeft: '48px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>Password</label>
             <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-light)" style={{ position: 'absolute', top: '16px', left: '16px' }}/>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p style={{ marginTop: '24px', color: 'var(--text-light)', fontSize: '14px' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Sign up</span>
        </p>

      </div>
    </div>
  );
}


