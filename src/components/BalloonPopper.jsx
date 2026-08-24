import React, { useState } from 'react';
import { playPopSound } from '../utils/synthMusic';

function BalloonPopper({ triggerConfetti }) {
  const [currentWish, setCurrentWish] = useState("Pop any balloon to reveal a birthday wish!");
  
  const [balloons, setBalloons] = useState([
    { id: 1, color: '#ff5490', left: 15, delay: 0.5, drift: 20, popped: false },
    { id: 2, color: '#ffd15b', left: 35, delay: 2.2, drift: -25, popped: false },
    { id: 3, color: '#70d6ff', left: 55, delay: 1.0, drift: 30, popped: false },
    { id: 4, color: '#ff9770', left: 75, delay: 3.5, drift: -15, popped: false },
    { id: 5, color: '#a29bfe', left: 25, delay: 4.8, drift: 25, popped: false },
    { id: 6, color: '#ff7675', left: 65, delay: 6.0, drift: -30, popped: false },
  ]);

  const wishes = [
    "Aap poore world ki sabse caring aur supportive friend ho! 🌸",
    "Humari dosti mere liye sabse bada blessing hai. Happy Birthday! 💖",
    "May this year bring you endless laughter, healthy sprints, and success! 😂",
    "Aapke saare life design goals aur tickets successfully deploy hon! ✨",
    "Cheers to another year of bike rides, road trips, and taking pange! 🥂",
    "Aap Haryana ki sabse dhasu chori ho, hamesha aise hi swag mein rehna! 🌟",
    "Thank you for bearing with all my nonsense and 'Rahapat' jokes! 🤗",
    "Hamesha rote-hote logon ko hansate raho. Keep shining, bestie! 🚀"
  ];

  const handleBalloonPop = (id, event) => {
    // Play synthesized pop sound effect
    playPopSound();
    
    // Trigger confetti explosion on exact tap coordinates
    if (triggerConfetti) {
      triggerConfetti(event.clientX, event.clientY, 25);
    }

    // Set popped state
    setBalloons(prev =>
      prev.map(balloon => (balloon.id === id ? { ...balloon, popped: true } : balloon))
    );

    // Pick a random wish to display
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    setCurrentWish(randomWish);

    // Respawn balloon after 3 seconds
    setTimeout(() => {
      setBalloons(prev =>
        prev.map(balloon =>
          balloon.id === id
            ? {
                ...balloon,
                popped: false,
                left: Math.max(8, Math.min(92, Math.random() * 84 + 8)),
                delay: 0,
              }
            : balloon
        )
      );
    }, 3500);
  };

  return (
    <div className="game-section">
      <h2 className="section-title">Pop-A-Balloon! 🎈</h2>
      <p className="section-sub">
        Balloons par click karke unhe phodo aur apne liye sweet birthday wishes unlock karo!
      </p>
      
      <div className="balloon-game-container">
        {balloons.map((balloon) => (
          !balloon.popped && (
            <div
              key={balloon.id}
              className="balloon"
              style={{
                left: `${balloon.left}%`,
                backgroundColor: balloon.color,
                color: balloon.color,
                animationDelay: `${balloon.delay}s`,
                '--drift-x': `${balloon.drift}px`
              }}
              onClick={(e) => handleBalloonPop(balloon.id, e)}
            >
              <div className="balloon-knot"></div>
            </div>
          )
        ))}
      </div>

      <div className="wish-reveal-box">
        <p id="wishText">{currentWish}</p>
      </div>
    </div>
  );
}

export default BalloonPopper;
