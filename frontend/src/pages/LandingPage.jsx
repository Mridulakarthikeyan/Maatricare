import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, ShieldAlert, MessageCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <Heart color="#e94a5a" fill="#e94a5a" size={28} />
          MaatriCare AI
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ fontWeight: 500 }}>Features</a>
          <a href="#about" style={{ fontWeight: 500 }}>About</a>
          <Link to="/login" className="btn-primary" style={{ padding: '8px 20px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        paddingTop: '80px'
      }}>
        <div style={{ flex: 1, paddingRight: '40px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            background: 'var(--white)',
            borderRadius: '20px',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '14px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow)'
          }}>
            ✨ AI-Powered Maternal Care
          </div>
          <h1 className="title-glow" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '24px' }}>
            Your Trusted Companion <br/>
            <span className="text-gradient">Through Motherhood</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '40px', maxWidth: '500px', lineHeight: 1.6 }}>
            Track your health, predict risks with AI, and get instant support—all in one beautiful app designed for expectant mothers.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/login" className="btn-primary">
              Start Your Journey <ArrowRight size={20} />
            </Link>
            <a href="#features" className="btn-primary" style={{ background: 'var(--white)', color: 'var(--text-dark)', boxShadow: 'var(--shadow)' }}>
              See Features
            </a>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {/* Abstract Hero Image Representation using Glass panels */}
          <div className="glass-panel" style={{ 
            width: '100%', 
            maxWidth: '500px', 
            height: '500px', 
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ 
               position: 'absolute', 
               width: '300px', 
               height: '300px', 
               background: 'var(--primary)', 
               borderRadius: '50%', 
               filter: 'blur(80px)', 
               opacity: 0.2,
               top: '-50px',
               right: '-50px'
             }}></div>
             <div style={{
                textAlign: 'center',
                padding: '40px'
             }}>
                <Heart size={120} color="#ff4da6" fill="#ff4da6" opacity={0.8} style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Safe & Secure</h3>
                <p style={{ color: 'var(--text-light)' }}>24/7 intelligent monitoring for you and your baby.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Everything You Need</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '60px', fontSize: '1.1rem' }}>Comprehensive tools designed to support you at every step.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          
          <FeatureCard 
            icon={<Activity size={32} color="var(--primary)" />}
            title="Health Tracking"
            desc="Monitor blood pressure, sugar levels and weight easily."
          />
          <FeatureCard 
            icon={<Heart size={32} color="var(--primary)" />}
            title="AI Risk Prediction"
            desc="Smart algorithms analyze your data to catch risks early."
          />
          <FeatureCard 
            icon={<ShieldAlert size={32} color="#ff4d4d" />}
            title="SOS Emergency"
            desc="One-tap alert to notify healthcare providers instantly."
          />
          <FeatureCard 
            icon={<MessageCircle size={32} color="var(--primary)" />}
            title="AI Chatbot"
            desc="Get instant answers to pregnancy questions 24/7."
          />

        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '40px' }}>
        <h3 style={{ marginBottom: '10px' }}>❤️ MaatriCare AI</h3>
        <p style={{ color: 'var(--text-light)' }}>© 2026 MaatriCare AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel" style={{ padding: '40px 24px', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ 
        width: '64px', height: '64px', 
        background: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: '20px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px auto',
        boxShadow: '0 4px 15px rgba(255,77,166,0.1)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'var(--text-light)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}
