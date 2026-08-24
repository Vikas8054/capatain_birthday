import React, { useState, useEffect } from 'react';
import { playPopSound } from '../utils/synthMusic';

function StoryBook({ onComplete, triggerConfetti }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [poBtnPos, setPoBtnPos] = useState({ position: 'static' });
  const [gameWon, setGameWon] = useState(false);

  const stories = [
    {
      title: "Colleague se Yaar Tak! 🏢❤️",
      isGame: false,
      image: "/memory_sprint.jpg"
    },
    {
      title: "Sath Mein Bike Par Jaana! 🏍️💨",
      isGame: false,
      image: "/memory_bike.jpg"
    },
    {
      title: "12:30 AM Cake Cutting! 🎂🥹",
      isGame: false,
      image: "/memory_cake.jpg"
    },
    {
      title: "Follow Back Kab Karegi? 😤📱",
      isGame: false,
      image: "/memory_instagram.jpg"
    },
    {
      title: "Rapte Khayegi? 👊👊",
      isGame: false,
      image: "/memory_rapte.jpg"
    },
    {
      title: "Playful Hair Pull Fights! 💇‍♂️💇‍♀️",
      isGame: false,
      image: "/memory_hair.jpg"
    },
    {
      title: "Who is the Boss? 🖥️",
      isGame: true,
      image: null,
      text: "Before you unlock the final birthday card, you must pass the PO vs Dev validation test. Sprints aur coding ka sach batao: Who is the real Boss of the sprint?"
    },
    {
      title: "Tera Permanent Dev & Crime Partner 🕶️🤝",
      isGame: false,
      image: "/memory_combo.jpg"
    }
  ];

  // Reset game states when navigating away
  useEffect(() => {
    setPoBtnPos({ position: 'static' });
    setGameWon(false);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < stories.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Move the PO button away on hover or click
  const movePoButton = () => {
    if (gameWon) return;
    const randomTop = Math.floor(Math.random() * 55) + 20; // 20% to 75%
    const randomLeft = Math.floor(Math.random() * 60) + 15; // 15% to 75%
    setPoBtnPos({
      position: 'absolute',
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
      zIndex: 10
    });
  };

  const handleDevWin = (e) => {
    setGameWon(true);
    playPopSound();
    
    // Confetti splash on target Dev button
    if (triggerConfetti) {
      const rect = e.target.getBoundingClientRect();
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }
  };

  const isNextDisabled = stories[currentPage].isGame && !gameWon;

  return (
    <div className="card-section storybook-container" style={{ position: 'relative' }}>
      {/* Progress Bar */}
      <div className="story-progress">
        <div 
          className="story-progress-bar" 
          style={{ width: `${((currentPage + 1) / stories.length) * 100}%` }}
        ></div>
        <span className="story-page-indicator">Memory {currentPage + 1} of {stories.length}</span>
      </div>

      {/* Story Card Content */}
      <div className="story-card">
        <h2 className="story-card-title">{stories[currentPage].title}</h2>

        <div className="story-text-container" style={{ justifyContent: 'center' }}>
          {!stories[currentPage].isGame ? (
            <>
              {stories[currentPage].image && (
                <div className="story-image-wrapper">
                  <img 
                    src={stories[currentPage].image} 
                    alt={stories[currentPage].title} 
                    className="story-img"
                  />
                </div>
              )}
              {currentPage === stories.length - 1 && (
                <p className="story-signature">
                  Miss you a lot, Captain. ❤️ <br/>
                  — Tera Permanent Dev & Crime Partner 😎❤️
                </p>
              )}
            </>
          ) : (
            /* Interactive PO vs Dev Runaway Button Game */
            <div className="boss-game-wrapper" style={{ position: 'relative', height: '100%', minHeight: '190px' }}>
              <p className="story-text" style={{ marginBottom: '20px', textAlign: 'center' }}>
                {stories[currentPage].text}
              </p>
              
              {!gameWon ? (
                <div className="game-buttons-layout">
                  <button 
                    className="btn btn-nav po-runaway-btn" 
                    style={poBtnPos}
                    onMouseEnter={movePoButton}
                    onTouchStart={movePoButton}
                    onClick={movePoButton}
                  >
                    PO 👩‍✈️
                  </button>
                  <button 
                    className="btn btn-nav dev-win-btn"
                    onClick={handleDevWin}
                  >
                    Dev 💻
                  </button>
                </div>
              ) : (
                <div className="game-win-banner" style={{ textAlign: 'center', animation: 'fadeInStory 0.4s forwards' }}>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>
                    Correct Choice! 🎉
                  </p>
                  <p className="story-text" style={{ textAlign: 'center' }}>
                    Access Approved. sir dard Dev ne ticket approve kar diya hai. Click <strong>Next</strong> to view your birthday card! 🚀
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="story-nav-buttons">
        <button 
          className={`btn btn-nav ${currentPage === 0 ? 'disabled' : ''}`} 
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          ⬅️ Back
        </button>
        <button 
          className={`btn btn-nav next-btn ${isNextDisabled ? 'disabled' : ''}`} 
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          {currentPage === stories.length - 1 ? "Let's Play! 🎈" : "Next ➡️"}
        </button>
      </div>
    </div>
  );
}

export default StoryBook;
