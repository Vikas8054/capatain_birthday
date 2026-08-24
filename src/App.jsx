import { useState, useEffect, useRef } from 'react';
import LockScreen from './components/LockScreen';
import StoryBook from './components/StoryBook';
import BalloonPopper from './components/BalloonPopper';
import MusicPlayer from './components/MusicPlayer';
import ThreeBackground from './components/ThreeBackground';
import { synthMusic } from './utils/synthMusic';
import './App.css';

/* ==========================================================================
   2D CONFETTI PARTICLE PHYSICS (For interactive card bursts & pops)
   ========================================================================== */
class ConfettiParticle {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = x !== undefined ? x : Math.random() * canvas.width;
    this.y = y !== undefined ? y : -10;
    
    // Confetti launch speeds and drop gravity
    this.size = Math.random() * 8 + 4;
    this.color = `hsl(${Math.random() * 360}, 95%, 60%)`;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = Math.random() * -12 - 4; // Fly upwards, then fall
    this.gravity = 0.35;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    this.ctx.restore();
  }
}

/* ==========================================================================
   MAIN APP ORCHESTRATOR
   ========================================================================== */
function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  const canvasRef = useRef(null);
  const confettiRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  // Trigger a confetti burst at target coordinates
  const triggerConfetti = (x, y, count = 70) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < count; i++) {
      confettiRef.current.push(new ConfettiParticle(canvas, x, y));
    }
  };

  // 2D Confetti Overlay Loop Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw confetti only when active
      if (confettiRef.current.length > 0) {
        confettiRef.current.forEach((particle) => {
          particle.update();
          particle.draw();
        });

        // Filter out dead particles that fall off-screen
        confettiRef.current = confettiRef.current.filter(
          (p) => p.y < canvas.height && p.y > -200
        );
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // Screen click/tap sparkles effect (confetti bursts on screen touch)
  useEffect(() => {
    const handleTapConfetti = (e) => {
      if (!unlocked) return;
      // Skip if tapping navigation items, balloons or game controls to avoid clashes
      if (
        e.target.closest('button') ||
        e.target.closest('.balloon')
      ) {
        return;
      }
      triggerConfetti(e.clientX, e.clientY, 8);
    };

    window.addEventListener('pointerdown', handleTapConfetti);
    return () => window.removeEventListener('pointerdown', handleTapConfetti);
  }, [unlocked]);

  // Gift box unlock unwrap trigger
  const handleUnlock = () => {
    setUnlocked(true);
    synthMusic.start();
    setMusicPlaying(true);
    // Explode a massive blast of confetti from the present center
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 85);
  };

  // Music toggle control
  const toggleMusic = () => {
    if (musicPlaying) {
      synthMusic.stop();
      setMusicPlaying(false);
    } else {
      synthMusic.start();
      setMusicPlaying(true);
    }
  };

  return (
    <>
      {/* Three.js 3D Hearts Background Layer */}
      {unlocked && (
        <ThreeBackground />
      )}

      {/* 2D Confetti Burst Overlay (always on top, pointer-events disabled) */}
      <canvas ref={canvasRef} className="particle-canvas" style={{ zIndex: 99, pointerEvents: 'none' }} />

      {/* Floating Audio Controller */}
      {unlocked && (
        <MusicPlayer playing={musicPlaying} onToggle={toggleMusic} />
      )}

      {/* SCREEN 1: LOCK SCREEN */}
      {!unlocked && (
        <LockScreen onUnlock={handleUnlock} />
      )}

      {/* SCREEN 2: MAIN DASHBOARD & STORIES */}
      {unlocked && (
        <section className="screen active">
          <div className="dashboard-container">
            {/* Header */}
            <header className="main-header">
              <h1 className="neon-text">Happy Birthday, Captain! 👩‍✈️🎂</h1>
              <p className="subtitle">Wishing the most wonderful senior PO a magical birthday!</p>
            </header>

            {/* Slider Deck */}
            {!showGame ? (
              <StoryBook 
                onComplete={() => {
                  setShowGame(true);
                  // Explode victory confetti
                  triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
                }} 
                triggerConfetti={triggerConfetti}
              />
            ) : (
              <BalloonPopper triggerConfetti={triggerConfetti} />
            )}

            {/* Footer */}
            <footer className="main-footer">
              <p>Made By tera Crime partner Dev 🕶️🤝</p>
            </footer>
          </div>
        </section>
      )}
    </>
  );
}

export default App;
