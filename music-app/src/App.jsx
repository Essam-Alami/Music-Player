import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import { MusicProvider } from './context/MusicContext';

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

function App() {
  return (
    <MusicProvider>
      <div className="app">
        <MusicPlayer />
      </div>
    </MusicProvider>
  );
}

export default App;
