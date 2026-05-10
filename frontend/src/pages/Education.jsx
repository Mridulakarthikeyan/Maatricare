import React from 'react';
import { BookOpen, Video, PlayCircle } from 'lucide-react';

export default function Education() {
  const [articles, setArticles] = React.useState([]);
  const [videos, setVideos] = React.useState([]);
  
  const [activeArticle, setActiveArticle] = React.useState(null);
  const [activeVideo, setActiveVideo] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/education')
      .then(res => res.json())
      .then(data => {
         setArticles(data.articles || []);
         setVideos(data.videos || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Educational Content</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', fontSize: '1.1rem' }}>Verified articles and tutorials to guide you safely.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Articles Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', marginBottom: '8px' }}>
              <BookOpen color="var(--primary)" /> Top Articles
            </h2>
            {articles.map((art, idx) => (
               <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{art.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Read Time: {art.readTime}</p>
                  </div>
                  <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveArticle(art)}>
                    Read
                  </button>
               </div>
            ))}
         </div>

         {/* Videos Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', marginBottom: '8px' }}>
              <Video color="var(--primary)" /> Video Guides
            </h2>
            {videos.map((vid, idx) => (
               <div key={idx} className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'} onClick={() => setActiveVideo(vid)}>
                  <div style={{ width: '100%', height: '120px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PlayCircle color="var(--primary)" size={40} opacity={0.8} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{vid.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Duration: {vid.length}</p>
               </div>
            ))}
         </div>
      </div>

      {/* Article Modal */}
      {activeArticle && (
         <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '40px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>{activeArticle.title}</h2>
            <div style={{ lineHeight: 1.8, color: 'var(--text-dark)' }}>
               <p style={{ marginBottom: '16px' }}>This is the full text content for "{activeArticle.title}". In a production app, this would be fetched from a CMS or Database.</p>
               <p style={{ marginBottom: '16px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac risus a nisi vulputate congue. Nulla facilisi. Praesent vestibulum tincidunt mattis.</p>
               <p style={{ marginBottom: '16px' }}>Suspendisse potenti. In hac habitasse platea dictumst. Morbi non sapien non sapien efficitur fermentum. Curabitur in metus vel justo iaculis venenatis.</p>
               <p style={{ marginBottom: '16px' }}>Always consult your primary healthcare physician regarding any information found here.</p>
            </div>
            <button className="btn-primary" onClick={() => setActiveArticle(null)} style={{ marginTop: '24px', width: '100%' }}>Close Article</button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
         <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setActiveVideo(null)}>
          <div style={{ width: '90%', maxWidth: '800px', background: '#000', borderRadius: '16px', overflow: 'hidden', position: 'relative' }} onClick={e => e.stopPropagation()}>
             <iframe width="100%" height="450" src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`} title={activeVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
             <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.8)', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveVideo(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
