import React, { useState } from 'react';
import { MapPin, Search, Phone, Star, Navigation } from 'lucide-react';

export default function HospitalFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/hospitals?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setHospitals(data))
        .catch(err => console.error(err));
    }, 300); // debounce API calls
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // We no longer need to filter client-side as the API handles it
  const filteredHospitals = hospitals;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Hospital & Doctor Finder</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', fontSize: '1.1rem' }}>Find trusted maternal care and emergency facilities near you.</p>

      <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
        
        {/* Left Side: List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ position: 'relative' }}>
             <Search size={20} color="var(--text-light)" style={{ position: 'absolute', top: '14px', left: '16px' }} />
             <input 
               type="text" 
               placeholder="Search by name, specialty, or zip code..." 
               style={{ paddingLeft: '48px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.8)' }}
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
           </div>

           <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
              {filteredHospitals.map((h, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '24px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                     <div>
                       <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '4px' }}>{h.name}</h3>
                       <p style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>{h.type}</p>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 189, 0, 0.2)', padding: '4px 8px', borderRadius: '8px', color: '#e6a800', fontWeight: 700, fontSize: '14px' }}>
                        <Star size={14} fill="#e6a800" color="#e6a800" /> {h.rating}
                     </div>
                   </div>

                   <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '14px' }}>
                        <MapPin size={16} /> {h.distance}
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '14px' }}>
                        <Phone size={16} /> {h.phone}
                     </div>
                   </div>

                   <button style={{ marginTop: '20px', width: '100%', padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' Hospital')}`, '_blank')}>
                     <Navigation size={18} /> Get Directions
                   </button>
                </div>
              ))}
              {filteredHospitals.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>No facilities found matching your search.</div>
              )}
           </div>
        </div>

        {/* Right Side: Interactive Map */}
        <div className="glass-panel" style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0eaf5' }}>
           <iframe 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               style={{ border: 0 }} 
               src="https://www.google.com/maps/embed/v1/search?q=hospitals&key=AIzaSyDummyKeyForHackathonDoNotUseInProd" 
               allowFullScreen>
           </iframe>
           
           {/* Fallback overlay since dummy key won't actually load map */}
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <MapPin color="var(--primary)" size={64} fill="var(--primary)" opacity={0.8} style={{ marginBottom: '16px' }} />
              <h2 style={{ color: 'var(--text-dark)' }}>Interactive Map Region</h2>
              <p style={{ color: 'var(--text-light)', maxWidth: '250px', margin: '0 auto', textAlign: 'center' }}>
                 (A valid Google Maps API Key is required to render the live iframe here. Directions buttons still work!)
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
