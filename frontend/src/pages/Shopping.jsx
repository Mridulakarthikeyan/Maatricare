import React from 'react';
import { ShoppingBag, Star, ExternalLink } from 'lucide-react';

export default function Shopping() {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/shopping')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-dark)' }}>Shopping & Recommendations</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', fontSize: '1.1rem' }}>Top-rated essentials recommended by MaatriCare experts.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {products.map((product, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '100%', height: '140px', background: `url(${product.image}) center/cover no-repeat`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
               {!product.image && <ShoppingBag color="var(--primary)" size={48} opacity={0.6} />}
            </div>
            
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px', textTransform: 'uppercase' }}>{product.category}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{product.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffbd00', fontWeight: 600, fontSize: '14px' }}>
                <Star size={16} fill="#ffbd00" /> {product.rating} / 5.0
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>{product.price}</span>
               <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }} onClick={() => window.open(product.url, '_blank')}>
                 Buy Now <ExternalLink size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
