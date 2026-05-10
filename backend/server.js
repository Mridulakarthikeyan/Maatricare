const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Mock Data Stores ---
let users = [];
let healthDataStore = {}; // mapping username to their health data
let remindersStore = {
  'test': [
    { id: 1, title: 'Ultrasound Scan', date: '2026-04-10', time: '10:00 AM', status: 'upcoming' },
    { id: 2, title: 'Blood Test', date: '2026-04-15', time: '09:00 AM', status: 'upcoming' }
  ]
};

// Static Data
const wellnessExercises = [
  { title: 'Prenatal Yoga', duration: '20 mins', level: 'Beginner', desc: 'Gentle stretching to relieve back pain.' },
  { title: 'Brisk Walking', duration: '30 mins', level: 'All Levels', desc: 'Improves cardiovascular health safely.' },
  { title: 'Kegel Exercises', duration: '5 mins', level: 'Daily', desc: 'Strengthens pelvic floor muscles.' },
  { title: 'Deep Breathing', duration: '10 mins', level: 'Relaxation', desc: 'Reduces stress and prepares for labor.' }
];

const shoppingProducts = [
  { name: 'Medela Freestyle Flex Breast Pump', rating: 4.8, price: '$350.00', category: 'Gear', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=breast+pump' },
  { name: 'PharMeDoc Pregnancy Pillow', rating: 4.9, price: '$45.00', category: 'Comfort', image: 'https://images.unsplash.com/photo-1584308666744-24d5e16541f4?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=pregnancy+pillow' },
  { name: 'Nature Made Prenatal Multivitamin', rating: 4.7, price: '$18.50', category: 'Supplements', image: 'https://images.unsplash.com/photo-1550572017-edb700f1c3dc?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=prenatal+vitamins' },
  { name: 'Earth Mama Organic Nipple Butter', rating: 4.9, price: '$12.99', category: 'Postpartum', image: 'https://images.unsplash.com/photo-1615397322901-ab44040a6b72?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=nipple+butter' },
  { name: 'Bio-Oil Skincare Oil', rating: 4.6, price: '$22.00', category: 'Skincare', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=stretch+mark+cream' },
  { name: 'Motherhood Maternity Nursing Bra', rating: 4.8, price: '$35.99', category: 'Wearables', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=nursing+bra' },
  { name: 'BabyBjörn Baby Carrier Mini', rating: 4.9, price: '$99.99', category: 'Gear', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=baby+carrier' },
  { name: 'Huggies Newborn Diapers', rating: 4.8, price: '$34.00', category: 'Essentials', image: 'https://images.unsplash.com/photo-1522771930-78848d92d3e8?auto=format&fit=crop&q=80&w=300', url: 'https://www.amazon.in/s?k=newborn+diapers' },
];

const dietPlans = {
  trimester1: {
    veg: { breakfast: ['Oatmeal with berries', 'Avocado toast', 'Ginger tea'], lunch: ['Lentil soup', 'Spinach salad', 'Quinoa bowl'], dinner: ['Paneer stir-fry', 'Brown rice', 'Steamed broccoli'] },
    nonveg: { breakfast: ['Scrambled eggs', 'Whole wheat toast', 'Ginger tea'], lunch: ['Chicken salad', 'Bone broth', 'Quinoa'], dinner: ['Baked salmon', 'Sweet potato', 'Asparagus'] }
  },
  trimester2: {
    veg: { breakfast: ['Greek yogurt with chia seeds', 'Banana smoothie'], lunch: ['Chickpea wrap', 'Carrot sticks'], dinner: ['Tofu curry', 'Chapati', 'Mixed greens'] },
    nonveg: { breakfast: ['Boiled eggs', 'Fruit bowl'], lunch: ['Turkey sandwich', 'Tomato Soup'], dinner: ['Grilled tuna or chicken', 'Brown rice', 'Green beans'] }
  },
  trimester3: {
    veg: { breakfast: ['Smoothie bowl', 'Walnuts'], lunch: ['Black bean salad', 'Hummus and pita'], dinner: ['Vegetable pasta', 'Garlic bread', 'Salad'] },
    nonveg: { breakfast: ['Omelette with veggies', 'Milk'], lunch: ['Chicken fajitas', 'Avocado salad'], dinner: ['Lean beef stir-fry', 'Soba noodles', 'Spinach'] }
  }
};

const educationData = {
  articles: [
    { title: 'Understanding Gestational Diabetes', readTime: '5 mins', type: 'article' },
    { title: 'Signs of Labor: What to Expect', readTime: '8 mins', type: 'article' },
    { title: 'Safe Sleeping Positions for Trimester 3', readTime: '4 mins', type: 'article' },
  ],
  videos: [
    { title: 'Breathing Techniques for Labor', length: '12:45', videoId: 'B-jWcWqLIno' },
    { title: 'Prenatal Yoga - 20 Min Routine', length: '20:15', videoId: 'B8JzZk8XEQE' },
    { title: 'How to relieve lower back pain', length: '08:30', videoId: '1LcvM3W0Uio' },
    { title: 'Nutrition Tips for 3rd Trimester', length: '15:20', videoId: 'w5k2v500Hj8' },
  ]
};

const hospitalsList = [
  { name: 'Ganga Women and Child Centre', distance: '2.5 km', rating: 4.9, phone: '+91 422 248 5000', type: 'Specialized 24/7', address: 'Swarnambika Layout, Coimbatore', status: 'Open Now' },
  { name: 'Women Center by Motherhood', distance: '4.2 km', rating: 4.8, phone: '+91 80 6723 8900', type: 'Maternity Clinic', address: 'Peelamedu, Coimbatore', status: 'Open Now' },
  { name: 'Sri Ramakrishna Hospital', distance: '5.8 km', rating: 4.7, phone: '+91 422 450 0000', type: 'General with Maternity Ward', address: 'Siddhapudur, Coimbatore', status: 'Open Now' },
  { name: 'Rao Hospital', distance: '3.1 km', rating: 4.6, phone: '+91 422 254 3444', type: 'Obstetrician', address: 'R.S. Puram, Coimbatore', status: 'Closed' },
  { name: 'Kovai Medical Center (KMCH)', distance: '8.0 km', rating: 4.8, phone: '+91 422 432 3800', type: 'Multispecialty 24/7', address: 'Avinashi Road, Coimbatore', status: 'Open Now' },
];

// --- Authentication ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });
    
    // Auto-create reminders for newly logged in users (Hackathon logic)
    const user = email.split('@')[0];
    if (!remindersStore[user]) {
       remindersStore[user] = [
         { id: Date.now(), title: 'Doctor Consultation', date: '2026-05-01', time: '11:00 AM', status: 'upcoming' }
       ];
    }
    return res.status(200).json({ message: "Login Successful", user });
});

// --- Health Tracking ---
app.post('/api/health', (req, res) => {
    const { username, bp, sugar, weight } = req.body;
    if (!username || !bp || !sugar || !weight) return res.status(400).json({ error: "Missing fields." });

    healthDataStore[username] = { bp, sugar, weight };
    
    let riskText = "";
    if (bp > 140 || sugar > 140) riskText = "⚠️ High Risk! Consult doctor immediately.";
    else if (bp > 120 || sugar > 110) riskText = "⚠️ Moderate Risk. Monitor regularly.";
    else riskText = "✅ You are in safe condition.";
    
    healthDataStore[username].riskText = riskText;
    res.status(200).json({ message: "Health data saved.", risk: riskText });
});

// --- Chatbot ---
app.post('/api/chat', (req, res) => {
    const msg = (req.body.message || "").toLowerCase();
    let reply = "I'm your MaatriCare AI assistant. I'm here for you 💕 Ask anything about pregnancy.";

    if (msg.includes("diet") || msg.includes("food")) reply = "Focus on a balanced diet: rich in iron, calcium, and folic acid. 🥗🍓";
    else if (msg.includes("exercise") || msg.includes("yoga")) reply = "Light walking and prenatal yoga are generally great! 🧘‍♀️🚶‍♀️";
    else if (msg.includes("bp") || msg.includes("pressure")) reply = "Normal BP during pregnancy is below 120/80. Monitor it regularly ❤️";
    else if (msg.includes("sugar")) reply = "Maintain sugar levels by avoiding processed sweets 🍎";
    else if (msg.includes("pain") || msg.includes("emergency")) reply = "⚠️ If you are experiencing severe pain, please use the SOS button immediately!";

    res.status(200).json({ reply });
});

// --- NEW FEATURES (Phase 2 APIs) ---

// 1. Reminders
app.get('/api/reminders/:username', (req, res) => {
    const user = req.params.username;
    res.json(remindersStore[user] || []);
});
app.post('/api/reminders/:username', (req, res) => {
    const user = req.params.username;
    if (!remindersStore[user]) remindersStore[user] = [];
    const newReminder = { id: Date.now(), ...req.body, status: 'upcoming' };
    remindersStore[user].push(newReminder);
    res.status(201).json(newReminder);
});

// 2. Wellness Data
app.get('/api/wellness', (req, res) => res.json(wellnessExercises));

// Diet Plan
app.get('/api/diet', (req, res) => {
    const trimester = req.query.trimester || 'trimester1';
    const type = req.query.type || 'veg';
    const plan = dietPlans[trimester]?.[type] || dietPlans.trimester1.veg;
    res.json(plan);
});

// 3. Shopping Data
app.get('/api/shopping', (req, res) => res.json(shoppingProducts));

// 4. Education Data
app.get('/api/education', (req, res) => res.json(educationData));

// 5. Hospital Finder
app.get('/api/hospitals', (req, res) => {
    const q = (req.query.q || "").toLowerCase();
    if (!q) return res.json(hospitalsList);
    const filtered = hospitalsList.filter(h => h.name.toLowerCase().includes(q) || h.type.toLowerCase().includes(q));
    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
