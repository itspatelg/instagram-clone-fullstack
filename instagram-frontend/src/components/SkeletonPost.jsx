import React from 'react';

const SkeletonPost = () => {
  return (
    <div style={{ width: '100%', maxWidth: '470px', margin: '20px auto', border: '1px solid #efefef', borderRadius: '8px', background: 'white' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <div className="skeleton-blink" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
        <div className="skeleton-blink" style={{ width: '120px', height: '12px', marginLeft: '10px' }}></div>
      </div>
      
      {/* Photo Area */}
      <div className="skeleton-blink" style={{ width: '100%', height: '400px' }}></div>
      
      {/* Caption Area */}
      <div style={{ padding: '15px' }}>
        <div className="skeleton-blink" style={{ width: '80%', height: '12px', marginBottom: '8px' }}></div>
        <div className="skeleton-blink" style={{ width: '50%', height: '12px' }}></div>
      </div>

      {/* Ye rahi CSS jo bina file ke chalegi */}
      <style>{`
        .skeleton-blink {
          background: #eee;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine {
          to { background-position-x: -200%; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonPost;