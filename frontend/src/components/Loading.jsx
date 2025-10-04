import React from 'react';

export default function Loading({ fullscreen = false }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: fullscreen ? '100vh' : '100%',
      width: '100%',  
      flexDirection: 'column'
    }}>
      <div className="spinner" style={{
        border: '4px solid rgba(0, 0, 0, 0.1)',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        borderLeftColor: '#000060',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '10px', fontSize: '3rem', color: 'white' }}>
        Loading...
      </p>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
