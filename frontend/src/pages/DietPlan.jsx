import React, { useState, useEffect } from 'react';
import { Apple, Coffee, Droplet, Search } from 'lucide-react';

export default function DietPlan() {
  const [trimester, setTrimester] = useState('trimester1');
  const [dietType, setDietType] = useState('veg');
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/diet?trimester=${trimester}&type=${dietType}`)
      .then(res => res.json())
      .then(data => setPlan(data))
      .catch(err => console.error(err));
  }, [trimester, dietType]);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Diet & Meal Plans</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', fontSize: '1.1rem' }}>Nutritious recommendations tailored for your pregnancy stage.</p>

      {/* Filter Form */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, minWidth: '200px' }}>
            <label>Select Trimester</label>
            <select value={trimester} onChange={e=>setTrimester(e.target.value)} style={{ padding: '14px', width: '100%', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.8)', fontSize: '1rem' }}>
               <option value="trimester1">First Trimester (Weeks 1-12)</option>
               <option value="trimester2">Second Trimester (Weeks 13-26)</option>
               <option value="trimester3">Third Trimester (Weeks 27-40)</option>
            </select>
         </div>
         <div style={{ flex: 1, minWidth: '200px' }}>
            <label>Dietary Preference</label>
            <select value={dietType} onChange={e=>setDietType(e.target.value)} style={{ padding: '14px', width: '100%', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.8)', fontSize: '1rem' }}>
               <option value="veg">Vegetarian</option>
               <option value="nonveg">Non-Vegetarian</option>
            </select>
         </div>
      </div>

      {plan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', textTransform: 'capitalize' }}>
              <Apple color="var(--primary)" /> {trimester.replace('trimester', 'Trimester ')} - {dietType} Plan
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
               
               <div style={{ background: 'rgba(255,255,255,0.4)', padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Breakfast</h3>
                  <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                    {plan.breakfast?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
               </div>

               <div style={{ background: 'rgba(255,255,255,0.4)', padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Lunch</h3>
                  <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                    {plan.lunch?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
               </div>

               <div style={{ background: 'rgba(255,255,255,0.4)', padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Dinner</h3>
                  <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                    {plan.dinner?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
               </div>

            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--primary)', padding: '16px', borderRadius: '50%' }}>
                   <Droplet color="white" size={32} />
                </div>
                <div>
                   <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Hydration Goal</h3>
                   <p style={{ color: 'var(--text-light)' }}>Drink 8-10 glasses of water daily</p>
                </div>
             </div>
             <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#ffa64d', padding: '16px', borderRadius: '50%' }}>
                   <Coffee color="white" size={32} />
                </div>
                <div>
                   <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Caffeine Limit</h3>
                   <p style={{ color: 'var(--text-light)' }}>Keep under 200mg per day</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
