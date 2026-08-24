import React from 'react';

function MusicPlayer({ playing, onToggle }) {
  return (
    <button className="music-toggle" onClick={onToggle} aria-label="Toggle Music">
      <span className={`music-icon ${playing ? 'playing' : ''}`}>🎵</span>
    </button>
  );
}

export default MusicPlayer;
