import React from 'react';
import { Calendar, Bell, Plus } from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');

  const fetchReminders = () => {
    const user = localStorage.getItem('maatriCareUser');
    fetch(`http://localhost:5000/api/reminders/${user}`)
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(err => console.error(err));
  };

  React.useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('maatriCareUser');
    if(!newTitle || !newDate || !newTime) return;

    await fetch(`http://localhost:5000/api/reminders/${user}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate, time: newTime })
    });
    
    setShowForm(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    fetchReminders();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-dark)' }}>My Reminders</h1>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '12px' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Reminder'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddReminder} className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
             <label>Title</label>
             <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} required placeholder="e.g. Ultrasound" />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
             <label>Date</label>
             <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} required />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
             <label>Time</label>
             <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
             <button type="submit" className="btn-primary" style={{ height: '52px' }}>Save</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {reminders.map(reminder => (
          <div key={reminder.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{reminder.title}</h3>
               <Bell color="var(--primary)" size={20} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}>
              <Calendar size={16} />
              <span>{reminder.date} at {reminder.time}</span>
            </div>

            <div style={{ 
               padding: '6px 12px', background: 'rgba(255, 77, 166, 0.1)', 
               color: 'var(--primary)', borderRadius: '8px', fontSize: '14px',
               fontWeight: 600, alignSelf: 'flex-start'
            }}>
              {reminder.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
