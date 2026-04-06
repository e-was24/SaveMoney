import React from 'react';

const LoadingScreen = ({ onFinished }) => {
  return (
    <div className="loading-screen" onAnimationEnd={(e) => {
      if (e.animationName === 'fadeOut') onFinished();
    }}>
      <div className="loading-content">
        <div className="logo-glow-wrapper">
          <img src="/logo.png" alt="Logo" className="loading-logo" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="loading-title">E-Money</h1>
        <p className="loading-subtitle">Pencatat Keuangan Pintar</p>
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
