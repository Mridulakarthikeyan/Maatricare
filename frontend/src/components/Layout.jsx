import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Utensils, Activity, ShoppingCart, BookOpen, MapPin, LogOut, Heart } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState('User');

  React.useEffect(() => {
    const storedUser = localStorage.getItem('maatriCareUser');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Reminders', path: '/reminders', icon: <CalendarClock size={20} /> },
    { name: 'Diet & Meals', path: '/diet', icon: <Utensils size={20} /> },
    { name: 'Wellness', path: '/wellness', icon: <Activity size={20} /> },
    { name: 'Shopping', path: '/shopping', icon: <ShoppingCart size={20} /> },
    { name: 'Education', path: '/education', icon: <BookOpen size={20} /> },
    { name: 'Hospital Finder', path: '/hospital-finder', icon: <MapPin size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('maatriCareUser');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient-start)' }}>
      {/* Sidebar */}
      <div className="glass-panel" style={{ 
        width: '260px', 
        padding: '32px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '0 24px 24px 0',
        borderLeft: 'none',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem', marginBottom: '48px', color: 'var(--text-dark)' }}>
           <Heart color="#e94a5a" fill="#e94a5a" /> MaatriCare AI
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-dark)',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255, 77, 166, 0.1)' }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
           <div style={{ marginBottom: '16px', fontWeight: 500 }}>Hi, {user} 👋</div>
           <button onClick={handleLogout} style={{ 
             display: 'flex', alignItems: 'center', gap: '8px',
             background: 'transparent', border: 'none', color: '#cc0000', 
             cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
             padding: '8px 0'
           }}>
             <LogOut size={20} /> Logout
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', height: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}
