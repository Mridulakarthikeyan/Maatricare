const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Mock Data Stores ---
let users = [];
let healthDataStore = {}; // legacy
let healthHistoryStore = {}; // mapping username to array of health records
let remindersStore = {
  'test': [
    { id: 1, title: 'Ultrasound Scan', date: '2026-04-10', time: '10:00 AM', status: 'upcoming' },
    { id: 2, title: 'Blood Test', date: '2026-04-15', time: '09:00 AM', status: 'upcoming' }
  ]
};

const wellnessExercises = [
  {
    title: 'Prenatal Yoga & Asanas', duration: '15 mins', level: 'Beginner', desc: 'Gentle stretching to relieve back pain. Includes Cat-Cow pose, Butterfly pose, and seated side bends.',
    sequence: [{ name: 'Cat-Cow Pose', duration: '5 mins', desc: 'Starting gentle spinal flex.' }, { name: 'Butterfly Pose', duration: '5 mins', desc: 'Opening the hips.' }, { name: 'Seated Side Bends', duration: '5 mins', desc: 'Stretching the obliques.' }]
  },
  {
    title: 'Brisk Walking', duration: '15 mins', level: 'All Levels', desc: 'Improves cardiovascular health safely. Recommended types.',
    sequence: [{ name: 'Heel-to-toe Walking', duration: '5 mins', desc: 'A gentle warm up.' }, { name: 'Incline Walking', duration: '5 mins', desc: 'Building leg strength.' }, { name: 'Interval Walking', duration: '5 mins', desc: 'Cooling down with mixed paces.' }]
  },
  {
    title: 'Kegel & Labor Prep Exercises', duration: '15 mins', level: 'Daily', desc: 'Strengthens pelvic floor muscles.',
    sequence: [{ name: 'Butterfly Exercise', duration: '5 mins', desc: 'Preparing the pelvic floor.' }, { name: 'Duck Walk', duration: '5 mins', desc: 'Opening the pelvis.' }, { name: 'Pelvic Tilts', duration: '5 mins', desc: 'Relieving lower back pressure.' }]
  },
  {
    title: 'Deep Breathing & Mindfulness', duration: '15 mins', level: 'Relaxation', desc: 'Reduces stress and prepares for labor.',
    sequence: [{ name: 'Alternate Nostril Breathing', duration: '5 mins', desc: 'Calming the nervous system.' }, { name: 'Belly Breathing', duration: '5 mins', desc: 'Connecting with your center.' }, { name: '4-7-8 Breathing', duration: '5 mins', desc: 'Deep relaxation.' }]
  }
];

const wellnessExercisesTa = [
  {
    title: 'கர்ப்பகால யோகா மற்றும் ஆசனங்கள்', duration: '15 நிமிடங்கள்', level: 'ஆரம்ப நிலை', desc: 'முதுகு வலியைப் போக்க எளிதான யோகா. இதில் பூனை-மாடு ஆசனம், பட்டாம்பூச்சி ஆசனம் ஆகியவை அடங்கும்.',
    sequence: [{ name: 'பூனை-மாடு ஆசனம்', duration: '5 நிமிடங்கள்', desc: 'முதுகெலும்பை தளர்த்துதல்.' }, { name: 'பட்டாம்பூச்சி ஆசனம்', duration: '5 நிமிடங்கள்', desc: 'இடுப்புப் பகுதியை விரிவுபடுத்துதல்.' }, { name: 'அமர்ந்த நிலையில் பக்கவாட்டு நீட்சி', duration: '5 நிமிடங்கள்', desc: 'உடலின் பக்கவாட்டு தசைகளை நீட்டுதல்.' }]
  },
  {
    title: 'வேகமான நடைபயிற்சி', duration: '15 நிமிடங்கள்', level: 'அனைத்து நிலைகளும்', desc: 'பாதுகாப்பாக இதய ஆரோக்கியத்தை மேம்படுத்துகிறது.',
    sequence: [{ name: 'குதிங்கால் வரை நடப்பது', duration: '5 நிமிடங்கள்', desc: 'ஒரு எளிய வார்ம் அப்.' }, { name: 'சாய்வான நடைபயிற்சி', duration: '5 நிமிடங்கள்', desc: 'கால் வலிமையை உருவாக்குதல்.' }, { name: 'இடைவெளி நடைபயிற்சி', duration: '5 நிமிடங்கள்', desc: 'வெவ்வேறு வேகங்களில் நடப்பது.' }]
  },
  {
    title: 'கீகல் மற்றும் பிரசவத்திற்கான பயிற்சிகள்', duration: '15 நிமிடங்கள்', level: 'தினசரி', desc: 'இடுப்பு தசைகளை பலப்படுத்துகிறது.',
    sequence: [{ name: 'பட்டாம்பூச்சி உடற்பயிற்சி', duration: '5 நிமிடங்கள்', desc: 'இடுப்பு பகுதியை தயார்படுத்துதல்.' }, { name: 'வாத்து நடை', duration: '5 நிமிடங்கள்', desc: 'இடுப்பைத் திறப்பது.' }, { name: 'பெல்விக் டில்ட்ஸ்', duration: '5 நிமிடங்கள்', desc: 'கீழ் முதுகு அழுத்தத்தை குறைத்தல்.' }]
  },
  {
    title: 'ஆழ்ந்த சுவாசம் மற்றும் தியானம்', duration: '15 நிமிடங்கள்', level: 'ஓய்வு', desc: 'மன அழுத்தத்தைக் குறைத்து பிரசவத்திற்குத் தயார் செய்கிறது.',
    sequence: [{ name: 'மாற்று நாசி சுவாசம்', duration: '5 நிமிடங்கள்', desc: 'நரம்பு மண்டலத்தை அமைதிப்படுத்துதல்.' }, { name: 'வயிற்று சுவாசம்', duration: '5 நிமிடங்கள்', desc: 'உடல் மையத்துடன் இணைதல்.' }, { name: '4-7-8 சுவாசம்', duration: '5 நிமிடங்கள்', desc: 'ஆழ்ந்த ஓய்வு.' }]
  }
];

const shoppingProducts = [
  {
    name: 'Pregnancy Pillow (U-Shaped)',
    desc: 'Provides full back and belly support for better sleep.',
    rating: 4.9,
    price: '₹1,499',
    category: 'Comfort',
    image: "/images/preg_pillow.png",
    url: 'https://www.amazon.in/s?k=pregnancy+pillow'
  },
  {
    name: 'Stylish Maternity Dress',
    desc: 'Breathable fabric designed to grow with your bump.',
    rating: 4.8,
    price: '₹999',
    category: 'Clothing',
    image:"/images/mat_dress.png",
    url: 'https://www.amazon.in/s?k=maternity+dress'
  },
  {
    name: 'Electric Breast Milk Pump',
    desc: 'Efficient, painless, and adjustable suction modes.',
    rating: 4.7,
    price: '₹2,500',
    category: 'Essentials',
    image: "/images/milkbump.jpeg",
    url: 'https://www.amazon.in/s?k=breast+milk+pump'
  },
  {
    name: 'Heating Pad for Back Pain',
    desc: 'Soothes lower back pressure with adjustable heat.',
    rating: 4.6,
    price: '₹750',
    category: 'Therapy',
    image: "/images/heat.jpeg",
    url: 'https://www.amazon.in/s?k=electric+heating+pad'
  },
  {
    name: 'Stretchable Maternity Leggings',
    desc: 'Over-the-bump soft compression wear.',
    rating: 4.9,
    price: '₹550',
    category: 'Clothing',
    image: "/images/pant.jpeg",
    url: 'https://www.amazon.in/s?k=maternity+leggings'
  },
  {
    name: 'Maternity Feeding Bra (Pack of 3)',
    desc: 'Seamless wireless bras for easy feeding.',
    rating: 4.7,
    price: '₹899',
    category: 'Clothing',
    image: "/images/bra.jpeg",
    url: 'https://www.amazon.in/s?k=maternity+feeding+bra'
  },
  {
    name: 'Soft Breathable Cotton Panties',
    desc: 'High-waisted pure cotton support panties.',
    rating: 4.8,
    price: '₹499',
    category: 'Clothing',
    image: "/images/panties.jpeg",
    url: 'https://www.amazon.in/s?k=maternity+panties+cotton'
  },
  {
    name: 'Loose Comfortable Nightwear',
    desc: 'Front-buttoned soft gown for easy movement.',
    rating: 4.5,
    price: '₹799',
    category: 'Clothing',
    image: "/images/dress.jpeg",
    url: 'https://www.amazon.in/s?k=maternity+nightwear'
  },
  {
    name: 'Pregnancy Cushion Sofa (Recliner)',
    desc: 'Luxury orthopedic recliner for ultimate rest.',
    rating: 4.9,
    price: '₹12,000',
    category: 'Comfort',
    image: "/images/sofa.jpeg",
    url: 'https://www.amazon.in/s?k=recliner+sofa+pregnancy'
  }
];

const shoppingProductsTa = [
  {
    name: 'கர்ப்பகால தலையணை (U-வடிவம்)',
    desc: 'நல்ல தூக்கத்திற்கு முதுகு மற்றும் வயிற்றுக்கு ஆதரவு தருகிறது.',
    rating: 4.9, price: '₹1,499', category: 'வசதி', image: "/images/preg_pillow.png", url: 'https://www.amazon.in/s?k=pregnancy+pillow'
  },
  {
    name: 'கர்ப்பகால ஆடை',
    desc: 'உங்கள் வயிற்றுக்கு ஏற்றவாறு விரிவடையும் சிறப்பான துணி.',
    rating: 4.8, price: '₹999', category: 'ஆடை', image:"/images/mat_dress.png", url: 'https://www.amazon.in/s?k=maternity+dress'
  },
  {
    name: 'எலக்ட்ரிக் தாய்ப்பால் பம்ப்',
    desc: 'எளிதான மற்றும் வலியற்ற தாய்ப்பால் சேகரிப்பு.',
    rating: 4.7, price: '₹2,500', category: 'அத்தியாவசியம்', image: 'https://placehold.co/600x400/e0e7ff/3730a3?text=Breast+Milk+Pump', url: 'https://www.amazon.in/s?k=breast+milk+pump'
  },
  {
    name: 'முதுகு வலிக்கான ஹீட்டிங் பேட்',
    desc: 'முதுகு வலியை குறைக்கும் வெந்நீர் ஒத்தடம்.',
    rating: 4.6, price: '₹750', category: 'சிகிச்சை', image: 'https://placehold.co/600x400/ffedd5/9a3412?text=Heating+Pad', url: 'https://www.amazon.in/s?k=electric+heating+pad'
  },
  {
    name: 'பிரியக்கூடிய கர்ப்பகால லெகிங்ஸ்',
    desc: 'மென்மையான, நன்கு விரிவடையக்கூடிய லெகிங்ஸ்.',
    rating: 4.9, price: '₹550', category: 'ஆடை', image: 'https://placehold.co/600x400/f3e8ff/6b21a8?text=Stretch+Leggings', url: 'https://www.amazon.in/s?k=maternity+leggings'
  },
  {
    name: 'தாய்ப்பால் கொடுப்பதற்கான பிரா (3-காம்போ)',
    desc: 'பாலிஸ்டர் இல்லாத மென்மையான பிராக்கள்.',
    rating: 4.7, price: '₹899', category: 'ஆடை', image: 'https://placehold.co/600x400/fecdd3/9f1239?text=Maternity+Bra', url: 'https://www.amazon.in/s?k=maternity+feeding+bra'
  },
  {
    name: 'மென்மையான பருத்தி உள்ளாடைகள்',
    desc: 'உயர் இடுப்பு பகுதியுடன் கூடிய தூய பருத்தி உள்ளாடைகள்.',
    rating: 4.8, price: '₹499', category: 'ஆடை', image: 'https://placehold.co/600x400/ccfbf1/115e59?text=Cotton+Panties', url: 'https://www.amazon.in/s?k=maternity+panties+cotton'
  },
  {
    name: 'வசதியான இரவு ஆடை',
    desc: 'எளிதில் நகரக்கூடிய முன் பொத்தான் உள்ள மென்மையான கௌன்.',
    rating: 4.5, price: '₹799', category: 'ஆடை', image: 'https://placehold.co/600x400/fef3c7/92400e?text=Nightwear', url: 'https://www.amazon.in/s?k=maternity+nightwear'
  },
  {
    name: 'கர்ப்பகால குஷன் சோபா',
    desc: 'முழு ஓய்வுக்கான சொகுசு சோபா.',
    rating: 4.9, price: '₹12,000', category: 'வசதி', image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Recliner+Sofa', url: 'https://www.amazon.in/s?k=recliner+sofa+pregnancy'
  }
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

const dietPlansTa = {
  trimester1: {
    veg: { breakfast: ['பெர்ரி பழங்களுடன் ஓட்ஸ்', 'அவகாடோ டோஸ்ட்', 'இஞ்சி டீ'], lunch: ['பருப்பு சூப்', 'பசலைக்கீரை சாலட்', 'குயினோவா'], dinner: ['பனீர் மசாலா', 'கைக்குத்தல் அரிசி', 'ப்ரோக்கோலி'] },
    nonveg: { breakfast: ['முட்டைப் பொடிமாஸ்', 'கோதுமை ரொட்டி', 'இஞ்சி டீ'], lunch: ['சிக்கன் சாலட்', 'எலும்பு சூப்', 'குயினோவா'], dinner: ['வேகவைத்த மீன்', 'இனிப்பு உருளைக்கிழங்கு', 'அஸ்பாரகஸ்'] }
  },
  trimester2: {
    veg: { breakfast: ['சியா விதைகளுடன் தயிர்', 'வாழைப்பழ ஸ்மூத்தி'], lunch: ['சுண்டல் மசாலா', 'கேரட்'], dinner: ['டோஃபு கறி', 'சப்பாத்தி', 'கலப்பு கீரைகள்'] },
    nonveg: { breakfast: ['வேகவைத்த முட்டைகள்', 'பழங்கள்'], lunch: ['சிக்கன் சாண்ட்விச்', 'தக்காளி சூப்'], dinner: ['வறுத்த சிக்கன்', 'கைக்குத்தல் அரிசி', 'பீன்ஸ்'] }
  },
  trimester3: {
    veg: { breakfast: ['பழங்கள் கிண்ணம்', 'வால்நட்ஸ்'], lunch: ['கருப்பு பீன்ஸ் சாலட்', 'சுண்டல்'], dinner: ['காய்கறி பாஸ்தா', 'பூண்டு ரொட்டி', 'சாலட்'] },
    nonveg: { breakfast: ['காய்கறி ஆம்லெட்', 'பால்'], lunch: ['சிக்கன் மசாலா', 'அவகாடோ சாலட்'], dinner: ['இறைச்சி கலவை', 'நூடுல்ஸ்', 'பசலைக்கீரை'] }
  }
};


const educationData = {
  articles: [
    { title: 'Understanding Gestational Diabetes', readTime: '5 mins', type: 'article' },
    { title: 'Signs of Labor: What to Expect', readTime: '8 mins', type: 'article' },
    { title: 'Safe Sleeping Positions for Trimester 3', readTime: '4 mins', type: 'article' },
    { title: 'How to Increase Hemoglobin During Pregnancy', readTime: '6 mins', type: 'article' },
    { title: 'Top 10 Superfoods for Expecting Mothers', readTime: '7 mins', type: 'article' },
    { title: 'Managing Swelling and Fluid Retention', readTime: '5 mins', type: 'article' },
    { title: 'Breastfeeding: A Complete Guide for Beginners', readTime: '10 mins', type: 'article' },
  ],
  videos: [
    { title: 'Breathing Techniques for Labor', length: '12:45', videoId: 'oXYhM26ACAU' },
    { title: 'Prenatal Yoga - 20 Min Routine', length: '20:15', videoId: 'feHp2b29G5U' },
    { title: 'How to relieve lower back pain', length: '08:30', videoId: 'S3xXurLpfDk' },
    { title: 'Nutrition Tips for 3rd Trimester', length: '03:20', videoId: 'F2L7gqwMfV0' },
    { title: 'Preparing Your Hospital Bag', length: '21:45', videoId: 'TylF0ueGCTM' },
    { title: 'First Steps for Breastfeeding', length: '27:06', videoId: '-Ds3QW3CWJ0' },
    { title: 'Understanding Postpartum Depression', length: '03:15', videoId: 'Aj1Vk3q-4tg' },
    { title: 'Newborn Care Basics', length: '06:28', videoId: 'CXWzqbe1i9c' }
  ],
};

const educationDataTa = {
  articles: [
    { title: 'கர்ப்பகால நீரிழிவு நோயை புரிந்துகொள்ளுதல்', readTime: '5 நிமிடங்கள்', type: 'article' },
    { title: 'பிரசவத்தின் அறிகுறிகள்: என்ன எதிர்பார்க்கலாம்', readTime: '8 நிமிடங்கள்', type: 'article' },
    { title: '3-வது மூன்று மாதங்களில் பாதுகாப்பான தூக்க நிலைகள்', readTime: '4 நிமிடங்கள்', type: 'article' },
    { title: 'கர்ப்ப காலத்தில் ஹீமோகுளோபினை அதிகரிப்பது எப்படி', readTime: '6 நிமிடங்கள்', type: 'article' },
    { title: 'கர்ப்பிணித் தாய்மார்களுக்கான சிறந்த 10 சூப்பர் உணவுகள்', readTime: '7 நிமிடங்கள்', type: 'article' },
    { title: 'வீக்கம் மற்றும் நீர் தேக்கத்தை கையாளுதல்', readTime: '5 நிமிடங்கள்', type: 'article' },
    { title: 'தாய்ப்பால்: ஆரம்பிப்பவர்களுக்கான முழு வழிகாட்டி', readTime: '10 நிமிடங்கள்', type: 'article' },
  ],
  videos: [
    { title: 'பிரசவத்திற்கான சுவாச நுட்பங்கள்', length: '12:45', videoId: 'oXYhM26ACAU' },
    { title: 'கர்ப்பகால யோகா - 20 நிமிட பயிற்சி', length: '20:15', videoId: 'feHp2b29G5U' },
    { title: 'கீழ் முதுகு வலியை போக்குவது எப்படி', length: '08:30', videoId: 'S3xXurLpfDk' },
    { title: '3-வது மூன்று மாதங்களுக்கான ஊட்டச்சத்து குறிப்புகள்', length: '03:20', videoId: 'F2L7gqwMfV0' },
    { title: 'மருத்துவமனை பையை தயார் செய்தல்', length: '21:45', videoId: 'TylF0ueGCTM' },
    { title: 'தாய்ப்பால் கொடுப்பதற்கான முதல் படிகள்', length: '27:06', videoId: '-Ds3QW3CWJ0' },
    { title: 'பிரசவத்திற்குப் பிந்தைய மனச்சோர்வைப் புரிந்துகொள்வது', length: '03:15', videoId: 'Aj1Vk3q-4tg' },
    { title: 'புதிதாக பிறந்த குழந்தையின் பராமரிப்பு அடிப்படைகள்', length: '06:28', videoId: 'CXWzqbe1i9c' }
  ],
};


const hospitalsList = [
  { name: 'Ganga Women and Child Centre', distance: '2.5 km', rating: 4.9, phone: '+91 422 248 5000', type: 'Specialized 24/7', address: 'Swarnambika Layout, Coimbatore', status: 'Open' },
  { name: 'Women Center by Motherhood', distance: '4.2 km', rating: 4.8, phone: '+91 80 6723 8900', type: 'Maternity Clinic', address: 'Peelamedu, Coimbatore', status: 'Open' },
  { name: 'Sri Ramakrishna Hospital', distance: '5.8 km', rating: 4.7, phone: '+91 422 450 0000', type: 'General with Maternity Ward', address: 'Siddhapudur, Coimbatore', status: 'Open' },
  { name: 'Rao Hospital', distance: '3.1 km', rating: 4.6, phone: '+91 422 254 3444', type: 'Obstetrician', address: 'R.S. Puram, Coimbatore', status: 'Closed' },
  { name: 'Kovai Medical Center (KMCH)', distance: '8.0 km', rating: 4.8, phone: '+91 422 432 3800', type: 'Multispecialty 24/7', address: 'Avinashi Road, Coimbatore', status: 'Open' },
  { name: 'PSG Hospitals', distance: '5.0 km', rating: 4.7, phone: '+91 422 257 0170', type: 'Multispecialty 24/7', address: 'Peelamedu, Coimbatore', status: 'Open' },
  { name: 'Gem Hospital', distance: '4.5 km', rating: 4.6, phone: '+91 422 232 5100', type: 'Specialty Care', address: 'Ramanathapuram, Coimbatore', status: 'Open' },
  { name: 'G. Kuppuswamy Naidu Memorial Hospital (GKNM)', distance: '3.8 km', rating: 4.8, phone: '+91 422 430 5300', type: 'General & Maternity', address: 'Pappanaickenpalayam, Coimbatore', status: 'Closed' }
];

// --- Authentication ---
app.post('/api/login', (req, res) => {
  const { email, password, isSignUp, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  // Auto-create reminders for newly logged in users (Hackathon logic)
  const user = isSignUp && firstName ? firstName : email.split('@')[0];
  if (!remindersStore[user]) {
    remindersStore[user] = [
      { id: Date.now(), title: 'Doctor Consultation', date: '2026-05-01', time: '11:00 AM', status: 'upcoming' }
    ];
  }
  return res.status(200).json({ message: "Login Successful", user });
});

app.get('/api/cravings', (req, res) => {
  const craving = req.query.craving || 'sweet';
  const type = req.query.type || 'veg';
  const tri = req.query.trimester || 'trimester1';
  const lang = req.query.lang || 'en';

  const cravingsDataEn = {
    sweet: ['Fresh fruits (banana, apple, mango)', 'Dates and dry fruits', 'Milk with honey', 'Dark chocolate (in moderation)', 'Cakes (low sugar / homemade preferred)', 'Chocolates (small portions)'],
    salty: ['Roasted makhana', 'Salted peanuts', 'Vegetable upma', 'Whole wheat sandwiches'],
    spicy: ['Lemon rice', 'Paneer tikka', 'Egg curry', 'Chicken curry (for non-veg)'],
    sour: ['Lemon water', 'Amla (gooseberry)', 'Orange / sweet lime', 'Tamarind-based dishes (limited)']
  };

  const optionsDataEn = {
    veg: ['Green leafy vegetables (spinach, broccoli)', 'Dal, legumes, sprouts', 'Paneer, milk, curd', 'Nuts & seeds'],
    nonveg: ['Eggs (rich in protein & choline)', 'Chicken (lean protein)', 'Fish (low mercury varieties)', 'Mutton (in moderation)']
  };

  const trimesterFocusEn = {
    trimester1: { focus: 'Folic acid & managing nausea', foods: ['Light foods (idli, dosa)', 'Fruits & juices', 'Ginger tea', 'Occasional sweet treats (small cake/chocolate)'] },
    trimester2: { focus: 'Protein & calcium', foods: ['Milk, paneer, curd', 'Eggs & chicken', 'Sprouts & dals', 'Limited desserts to avoid excess sugar'] },
    trimester3: { focus: 'Iron & energy', foods: ['Dates & bananas', 'Red rice', 'Green vegetables', 'Avoid excess sweets to prevent weight issues'] }
  };

  const avoidFoodsEn = ['Excess cakes, pastries, chocolates', 'High sugar intake (risk of gestational diabetes)', 'Junk and processed foods', 'Excess caffeine'];

  const cravingsDataTa = {
    sweet: ['புதிய பழங்கள் (வாழைப்பழம், ஆப்பிள், மாம்பழம்)', 'பேரீச்சம்பழம் மற்றும் உலர் பழங்கள்', 'தேன் கலந்த பால்', 'டார்க் சாக்லேட் (அளவோடு)', 'கேக்குகள் (குறைந்த சர்க்கரை / வீட்டில் தயாரிக்கப்பட்டவை)', 'சாக்லேட்டுகள் (சிறிய அளவு)'],
    salty: ['வறுத்த மக்கானா', 'உப்பு சேர்க்கப்பட்ட வேர்க்கடலை', 'காய்கறி உப்புமா', 'கோதுமை சாண்ட்விச்கள்'],
    spicy: ['எலுமிச்சை சாதம்', 'பனீர் டிக்கா', 'முட்டை கறி', 'சிக்கன் கறி (அசைவத்திற்கு)'],
    sour: ['எலுமிச்சை நீர்', 'நெல்லிக்காய்', 'ஆரஞ்சு / சாத்துக்குடி', 'புளி கலந்த உணவுகள் (அளவோடு)']
  };

  const optionsDataTa = {
    veg: ['பச்சை இலை காய்கறிகள் (கீரை, ப்ரோக்கோலி)', 'பருப்பு வகைகள், முளைகட்டிய பயறுகள்', 'பனீர், பால், தயிர்', 'நட்ஸ் மற்றும் விதைகள்'],
    nonveg: ['முட்டை (புரதம் மற்றும் கோலின் நிறைந்தது)', 'சிக்கன்', 'மீன் (குறைந்த பாதரசம் உள்ளவை)', 'மட்டன் (அளவோடு)']
  };

  const trimesterFocusTa = {
    trimester1: { focus: 'போலிக் அமிலம் மற்றும் குமட்டலை நிர்வகித்தல்', foods: ['எளிதில் செரிமானமாகும் உணவுகள் (இட்லி, தோசை)', 'பழங்கள் மற்றும் ஜூஸ்', 'இஞ்சி டீ', 'அவ்வப்போது இனிப்புகள் (சிறிய கேக்/சாக்லேட்)'] },
    trimester2: { focus: 'புரதம் மற்றும் கால்சியம்', foods: ['பால், பனீர், தயிர்', 'முட்டை மற்றும் சிக்கன்', 'முளைகட்டிய பயறுகள் மற்றும் பருப்பு', 'குறைவான இனிப்புகள்'] },
    trimester3: { focus: 'இரும்புச்சத்து மற்றும் ஆற்றல்', foods: ['பேரீச்சம்பழம் மற்றும் வாழைப்பழம்', 'சிகப்பரிசி', 'பச்சை காய்கறிகள்', 'அதிக இனிப்புகளைத் தவிர்க்கவும்'] }
  };

  const avoidFoodsTa = ['அதிக கேக், பேஸ்ட்ரி, சாக்லேட்', 'அதிக சர்க்கரை (கர்ப்பகால நீரிழிவு ஏற்படும் அபாயம்)', 'துரித உணவுகள்', 'அதிக அளவு காஃபின்'];

  const cravingsData = lang === 'ta' ? cravingsDataTa : cravingsDataEn;
  const optionsData = lang === 'ta' ? optionsDataTa : optionsDataEn;
  const trimesterFocus = lang === 'ta' ? trimesterFocusTa : trimesterFocusEn;
  const avoidFoods = lang === 'ta' ? avoidFoodsTa : avoidFoodsEn;

  res.json({
    cravingSuggestions: cravingsData[craving] || [],
    proteinOptions: optionsData[type] || [],
    trimesterGuide: trimesterFocus[tri] || {},
    avoid: avoidFoods
  });
});

// --- Health Tracking ---
app.get('/api/health/:username', (req, res) => {
  const user = req.params.username;
  res.json(healthHistoryStore[user] || []);
});

app.post('/api/health', (req, res) => {
  const { username, age, bp, sugar, weight, sleep, water, mood, lang } = req.body;
  if (!username || !bp || !sugar || !weight) return res.status(400).json({ error: "Missing fields." });

  if (!healthHistoryStore[username]) healthHistoryStore[username] = [];
  const history = healthHistoryStore[username];
  const prevEntry = history.length > 0 ? history[history.length - 1] : null;

  const newEntry = {
    id: Date.now(),
    username,
    date: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString(),
    age,
    bp: parseInt(bp),
    sugar: parseInt(sugar),
    weight: parseFloat(weight),
    sleep: parseFloat(sleep || 0),
    water: parseInt(water || 0),
    mood: mood || 'neutral'
  };

  let riskText = "";
  if (newEntry.bp > 140 || newEntry.sugar > 140) riskText = lang === 'ta' ? "⚠️ அதிக ஆபத்து! உடனடியாக மருத்துவரை அணுகவும்." : "⚠️ High Risk! Consult doctor immediately.";
  else if (newEntry.bp > 120 || newEntry.sugar > 110) riskText = lang === 'ta' ? "⚠️ மிதமான ஆபத்து. தொடர்ந்து கண்காணிக்கவும்." : "⚠️ Moderate Risk. Monitor regularly.";
  else riskText = lang === 'ta' ? "✅ நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்." : "✅ You are in safe condition.";

  let comparisonText = "";
  if (prevEntry) {
    let texts = [];
    const bpDiff = prevEntry.bp - newEntry.bp;
    if (bpDiff > 0) texts.push(lang === 'ta' ? `BP ${bpDiff} pt குறைந்துள்ளது - நல்ல முன்னேற்றம்!` : `BP reduced by ${bpDiff} points - Good improvement!`);
    else if (bpDiff < 0) texts.push(lang === 'ta' ? `BP ${Math.abs(bpDiff)} pt அதிகரித்துள்ளது - கவனிக்கவும்.` : `BP increased by ${Math.abs(bpDiff)} points - Take care.`);

    const sugDiff = prevEntry.sugar - newEntry.sugar;
    if (sugDiff > 0) texts.push(lang === 'ta' ? `சர்க்கரை ${sugDiff} mg/dL குறைந்துள்ளது - நல்ல முன்னேற்றம்!` : `Sugar reduced by ${sugDiff} mg/dL - Good improvement!`);
    else if (sugDiff < 0) texts.push(lang === 'ta' ? `சர்க்கரை ${Math.abs(sugDiff)} mg/dL அதிகரித்துள்ளது - கவனிக்கவும்.` : `Sugar increased by ${Math.abs(sugDiff)} mg/dL - Take care.`);

    const wtDiff = (newEntry.weight - prevEntry.weight).toFixed(1);
    if (wtDiff > 0) texts.push(lang === 'ta' ? `எடை ${wtDiff} kg அதிகரித்துள்ளது - நல்லது!` : `Weight increased by ${wtDiff} kg - Good!`);
    else if (wtDiff < 0) texts.push(lang === 'ta' ? `எடை ${Math.abs(wtDiff)} kg குறைந்துள்ளது.` : `Weight decreased by ${Math.abs(wtDiff)} kg.`);

    if (newEntry.sleep > 0 && prevEntry.sleep > 0) {
      const slpDiff = (newEntry.sleep - prevEntry.sleep).toFixed(1);
      if (slpDiff > 0) texts.push(lang === 'ta' ? `தூக்கம் அதிகமானது.` : `Sleep improved.`);
    }

    comparisonText = texts.length > 0 ? texts.join(' | ') : (lang === 'ta' ? `நிலையான ஆரோக்கியம்.` : `Stable health metrics.`);
  }

  newEntry.riskText = riskText;
  newEntry.comparisonText = comparisonText;

  healthHistoryStore[username].push(newEntry);
  res.status(200).json({ message: "Health data saved.", risk: riskText, comparison: comparisonText, history: healthHistoryStore[username] });
});

// --- Chatbot ---
app.post('/api/chat', (req, res) => {
  const msg = (req.body.message || "").toLowerCase();
  const lang = req.body.lang || 'en';

  // Default reply
  let replyEn = "As a professional MaatriCare AI, I am here to assist you comprehensively throughout your maternity journey. How can I help you today?";
  let replyTa = "ஒரு தொழில்முறை மாத்ரிகேர் AI ஆக, உங்கள் தாய்மைப் பயணம் முழுவதும் உங்களுக்கு உதவ நான் இங்கு இருக்கிறேன். நான் உங்களுக்கு எப்படி உதவ முடியும்?";

  if (msg.includes('diet') || msg.includes('food') || msg.includes('eating') || msg.includes('eat') || msg.includes('உணவு') || msg.includes('சாப்பாடு') || msg.includes('டயட்')) {
    replyEn = "For a healthy pregnancy diet, eat a balanced diet including fruits, vegetables, whole grains, milk, and protein-rich foods. Avoid raw fish, unpasteurized cheese, and raw meat.";
    replyTa = "ஆரோக்கியமான கர்ப்ப கால உணவுக்கு, பழங்கள், காய்கறிகள், முழு தானியங்கள், பால் மற்றும் புரதச்சத்து நிறைந்த உணவுகள் உட்பட சீரான உணவை உண்ணுங்கள். பச்சையான இறைச்சி மற்றும் அதிகப்படியான காஃபின் ஆகியவற்றைத் தவிர்க்கவும்.";
  } else if (msg.includes('vomit') || msg.includes('nausea') || msg.includes('morning') || msg.includes('வாந்தி') || msg.includes('குமட்டல்')) {
    replyEn = "Yes, mild vomiting is common especially in early pregnancy. Stay hydrated and eat small frequent meals.";
    replyTa = "ஆம், கர்ப்ப காலத்தின் ஆரம்பத்தில் லேசான வாந்தி பொதுவானது. நீரேற்றமாக இருங்கள் மற்றும் சிறிய அடிக்கடி உணவுகளை உண்ணுங்கள்.";
  } else if (msg.includes('early') || msg.includes('symptom') || msg.includes('அறிகுறி')) {
    replyEn = "Common symptoms include nausea, fatigue, missed periods, breast tenderness, and mood changes.";
    replyTa = "பொதுவான அறிகுறிகளில் குமட்டல், சோர்வு, மாதவிடாய் தவறுதல், மார்பக மென்மை மற்றும் மனநிலை மாற்றங்கள் ஆகியவை அடங்கும்.";
  } else if (msg.includes('how long') || msg.includes('duration') || msg.includes('எவ்வளவு காலம்') || msg.includes('எத்தனை மாதம்')) {
    replyEn = "A normal pregnancy lasts about 9 months (40 weeks).";
    replyTa = "சாதாரண கர்ப்பம் சுமார் 9 மாதங்கள் (40 வாரங்கள்) நீடிக்கும்.";
  } else if (msg.includes('hemoglobin') || msg.includes('iron') || msg.includes('இரும்புச்சத்து') || msg.includes('ஹீமோகுளோபின்')) {
    replyEn = "Eat iron-rich foods like spinach, dates, beetroot, and legumes to increase hemoglobin.";
    replyTa = "ஹீமோகுளோபினை அதிகரிக்க கீரை, பேரீச்சம்பழம், பீட்ரூட் மற்றும் பருப்பு வகைகள் போன்ற இரும்புச்சத்து நிறைந்த உணவுகளை உண்ணுங்கள்.";
  } else if (msg.includes('coffee') || msg.includes('caffeine') || msg.includes('காபி') || msg.includes('காஃபின்')) {
    replyEn = "Limit caffeine intake. It is better to avoid or drink in small amounts.";
    replyTa = "காஃபின் உட்கொள்ளலைக் கட்டுப்படுத்துங்கள். தவிர்ப்பது அல்லது சிறிய அளவில் குடிப்பது நல்லது.";
  } else if (msg.includes('avoid') || msg.includes('தவிர்க்க')) {
    replyEn = "Avoid raw meat, alcohol, unpasteurized dairy, and junk food.";
    replyTa = "பச்சையான இறைச்சி, மது, பாஸ்டுரைஸ் செய்யப்படாத பால் உணவுகள் மற்றும் குப்பை உணவுகளைத் தவிர்க்கவும்.";
  } else if (msg.includes('stomach') || msg.includes('cramp') || msg.includes('வயிறு') || msg.includes('வலி')) {
    replyEn = "Mild pain can be normal due to body changes, but severe pain requires medical attention. Press the SOS button if needed.";
    replyTa = "உடல் மாற்றங்கள் காரணமாக லேசான வலி சாதாரணமாக இருக்கலாம், ஆனால் கடுமையான வலிக்கு மருத்துவ கவனிப்பு தேவை. தேவைப்பட்டால் அவசர உதவி பொத்தானை அழுத்தவும்.";
  } else if (msg.includes('headache') || msg.includes('தலைவலி')) {
    replyEn = "Occasional headaches are common, but frequent or severe headaches should be checked by a doctor.";
    replyTa = "அவ்வப்போது தலைவலி பொதுவானது, ஆனால் அடிக்கடி அல்லது கடுமையான தலைவலியைக் கண்டால் மருத்துவரை அணுக வேண்டும்.";
  } else if (msg.includes('swell') || msg.includes('leg') || msg.includes('வீக்கம்') || msg.includes('கால் வீக்கம்')) {
    replyEn = "Mild swelling is normal. Elevate your legs and stay hydrated. Consult a doctor if severe.";
    replyTa = "லேசான வீக்கம் இயல்பானது. கால்களை உயர்த்தி வைத்து, நீர்ச்சத்து குறைவில்லாமல் பார்த்துக் கொள்ளுங்கள். கடுமையாக இருந்தால் மருத்துவரை அணுகவும்.";
  } else if (msg.includes('bleeding') || msg.includes('blood') || msg.includes('ரத்தம்') || msg.includes('இரத்தப்போக்கு')) {
    replyEn = "Yes, bleeding during pregnancy can be dangerous. Seek medical help immediately.";
    replyTa = "ஆம், கர்ப்ப காலத்தில் இரத்தப்போக்கு ஆபத்தானது. உடனடியாக மருத்துவ உதவியை நாடுங்கள்.";
  } else if (msg.includes('bp') || msg.includes('blood pressure') || msg.includes('பிபி') || msg.includes('இரத்த அழுத்தம்')) {
    replyEn = "To control blood pressure: Reduce salt intake, avoid stress, and follow doctor's advice. High BP symptoms include severe headache, blurred vision, and swelling. Seek medical care if you experience these.";
    replyTa = "இரத்த அழுத்தத்தைக் கட்டுப்படுத்த: உப்பு உட்கொள்ளலைக் குறைக்கவும், மன அழுத்தத்தைத் தவிர்க்கவும். உயர் ரத்த அழுத்த அறிகுறிகள் கடுமையான தலைவலி, பார்வை மங்குதல் மற்றும் வீக்கம். இவற்றை அனுபவித்தால் மருத்துவரை அணுகவும்.";
  } else if (msg.includes('sugar') || msg.includes('diabetes') || msg.includes('சர்க்கரை') || msg.includes('நீரிழிவு')) {
    replyEn = "To control sugar level: Maintain a healthy diet, avoid sugary foods, and exercise regularly.";
    replyTa = "சர்க்கரை அளவைக் கட்டுப்படுத்த: ஆரோக்கியமான உணவைப் பராமரிக்கவும், சர்க்கரை உணவுகளைத் தவிர்க்கவும், தொடர்ந்து உடற்பயிற்சி செய்யவும்.";
  } else if (msg.includes('water') || msg.includes('drink') || msg.includes('தண்ணீர்') || msg.includes('குடிக்க')) {
    replyEn = "You should drink at least 8–10 glasses of water daily.";
    replyTa = "நீங்கள் தினமும் குறைந்தது 8-10 கிளாஸ் தண்ணீர் குடிக்க வேண்டும்.";
  } else if (msg.includes('exercise') || msg.includes('walking') || msg.includes('walk') || msg.includes('உடற்பயிற்சி') || msg.includes('நடைபயிற்சி')) {
    replyEn = "Yes, walking is one of the safest exercises during pregnancy. Light exercise like walking is beneficial unless advised otherwise by a doctor.";
    replyTa = "ஆம், நடப்பது மிகவும் பாதுகாப்பான உடற்பயிற்சிகளில் ஒன்றாகும். மருத்துவர் அறிவுறுத்தாதவரை மிதமான உடற்பயிற்சிகள் நன்மை பயக்கும்.";
  } else if (msg.includes('travel') || msg.includes('பயணம்') || msg.includes('பயனிக்க')) {
    replyEn = "Travel is generally safe in early stages, but consult your doctor before long trips.";
    replyTa = "பயணம் பொதுவாக ஆரம்ப கட்டங்களில் பாதுகாப்பானது, ஆனால் நீண்ட பயணங்களுக்கு முன் மருத்துவரை அணுகவும்.";
  } else if (msg.includes('severe pain') || msg.includes('emergency') || msg.includes('கடுமையான வலி') || msg.includes('அவசரம்')) {
    replyEn = "Seek medical help immediately. Please press the SOS button.";
    replyTa = "உடனடியாக மருத்துவ உதவியை நாடுங்கள். அவசர உதவி பொத்தானை அழுத்தவும்.";
  } else if (msg.includes('baby') || msg.includes('move') || msg.includes('kick') || msg.includes('குழந்தை') || msg.includes('அசைவு')) {
    replyEn = "Baby not moving can be serious. Contact your doctor immediately.";
    replyTa = "குழந்தை நகரவில்லை என்பது ஆபத்தானது. உடனடியாக உங்கள் மருத்துவரை தொடர்பு கொள்ளவும்.";
  } else if (msg.includes('breastfeed') || msg.includes('feed') || msg.includes('தாய்ப்பால்')) {
    replyEn = "Breastfeeding tips: Feed regularly, stay hydrated, and maintain proper posture.";
    replyTa = "தாய்ப்பால் குறிப்புகள்: தொடர்ந்து உணவளிக்கவும், நீரேற்றமாக இருக்கவும், சரியான தோரணையைப் பராமரிக்கவும்.";
  } else if (msg.includes('recover') || msg.includes('delivery') || msg.includes('பிரசவம்') || msg.includes('மீட்பு')) {
    replyEn = "To recover after delivery: Eat nutritious food, rest well, and follow doctor's guidance.";
    replyTa = "பிரசவத்திற்குப் பிறகு மீட்க: சத்தான உணவை உண்ணுங்கள், நன்றாக ஓய்வெடுங்கள் மற்றும் மருத்துவர் வழிகாட்டுதல்களைப் பின்பற்றவும்.";
  } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('வணக்கம்') || msg.includes('ஹலோ')) {
    replyEn = "Hello! I am your advanced MaatriCare Professional AI. I can answer complex questions about your trimester, fetal development, nutrition, symptoms, or labor preparation. What's on your mind?";
    replyTa = "வணக்கம்! நான் உங்கள் மேம்பட்ட மாத்ரிகேர் ஆலோசனையாளர். உங்கள் கேள்விகளைக் கேளுங்கள்.";
  }

  const reply = lang === 'ta' ? replyTa : replyEn;
  res.status(200).json({ reply });
});

// --- NEW FEATURES (Phase 2 APIs) ---

// 1. Reminders
app.get('/api/reminders/:username', (req, res) => {
  const user = req.params.username;

  // Auto-seed for presentation if empty
  if (!remindersStore[user] || remindersStore[user].length === 0) {
    const now = new Date();
    const futureDate = now.toISOString().split('T')[0];
    // Add 1 minute
    now.setMinutes(now.getMinutes() + 1);
    const formatH = now.getHours().toString().padStart(2, '0');
    const formatM = now.getMinutes().toString().padStart(2, '0');
    const futureTime = `${formatH}:${formatM}`;

    remindersStore[user] = [
      { id: Date.now(), title: "Medicine Intake & Hydration ", date: futureDate, time: futureTime, status: 'upcoming' },
      { id: Date.now() + 1, title: "Doctor Checkup & Scan ", date: futureDate, time: "18:00", status: 'upcoming' }
    ];
  }

  res.json(remindersStore[user]);
});
app.post('/api/reminders/:username', (req, res) => {
  const user = req.params.username;
  if (!remindersStore[user]) remindersStore[user] = [];
  const newReminder = { id: Date.now(), ...req.body, status: 'upcoming' };
  remindersStore[user].push(newReminder);
  res.status(201).json(newReminder);
});
app.put('/api/reminders/:username/:id', (req, res) => {
  const user = req.params.username;
  if (remindersStore[user]) {
    const r = remindersStore[user].find(r => r.id.toString() === req.params.id);
    if (r) r.status = 'completed';
  }
  res.json({ success: true });
});

// 2. Wellness Data
app.get('/api/wellness', (req, res) => {
  const lang = req.query.lang || 'en';
  if (lang === 'ta') {
    return res.json(wellnessExercisesTa);
  }
  res.json(wellnessExercises);
});

// Diet Plan
app.get('/api/diet', (req, res) => {
  const trimester = req.query.trimester || 'trimester1';
  const type = req.query.type || 'veg';
  const lang = req.query.lang || 'en';

  const db = lang === 'ta' ? dietPlansTa : dietPlans;
  const plan = db[trimester]?.[type] || db.trimester1.veg;
  res.json(plan);
});

// 3. Shopping Data
app.get('/api/shopping', (req, res) => {
  const lang = req.query.lang || 'en';
  if (lang === 'ta') {
    return res.json(shoppingProductsTa);
  }
  res.json(shoppingProducts);
});

// 4. Education Data
app.get('/api/education', (req, res) => {
  const lang = req.query.lang || 'en';
  if (lang === 'ta') {
    return res.json(educationDataTa);
  }
  res.json(educationData);
});

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
