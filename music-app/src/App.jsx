import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import { MusicProvider } from './context/MusicContext';

function App() {
  return (
    <MusicProvider>
      <div className="app">
        <div className="container">
          <h1>Spotify Music Player</h1>
          <MusicPlayer />
        </div>
      </div>
    </MusicProvider>
  );
}

export default App;
