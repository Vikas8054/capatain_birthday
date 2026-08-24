import React from 'react';

function LockScreen({ onUnlock }) {
  return (
    <section className="screen lock-screen-layout active">
      <div className="lock-container">
        <div className="glow-orb"></div>
        <div className="cats-banner-wrapper">
          <img src="/cats_welcome.jpg" alt="Cute Cats" className="cats-banner-img" />
        </div>

        <div className="present-box" onClick={onUnlock}>
          <div className="lid"></div>
          <div className="box-body"></div>
          <div className="ribbon-v"></div>
          <div className="ribbon-h"></div>
          <div className="bow"></div>
        </div>
        <h1 className="welcome-title">Hey Captain 👩‍✈️! ✨</h1>
        <p className="welcome-sub">
          Aapke liye ek special birthday surprise hai... Tap the present to unwrap it!
        </p>
        <button className="btn btn-unlock" onClick={onUnlock}>
          Unwrap Present 🎁
        </button>
      </div>
    </section>
  );
}

export default LockScreen;
