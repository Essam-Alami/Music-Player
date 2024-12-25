import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1>Music Player</h1>
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
