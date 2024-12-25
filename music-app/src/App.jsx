import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import { MusicProvider } from './context/MusicContext';

// Main App Component
function App() {
  return (
    <MusicProvider>
      <div className="app">
        <div className="container">
          <h1>Music Player</h1>
          <MusicPlayer />
        </div>
      </div>
    </MusicProvider>
  );
}

export default App;
