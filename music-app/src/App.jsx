import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import { MusicProvider } from './context/MusicContext';
import './App.css';

function App() {
  return (
    <MusicProvider>
      <div className="app">
        <div className="container">
          <h1>🎵 Musices 🎵</h1>
          <MusicPlayer />
          <footer>
            <p>&copy; 2024 - All Rights Reserved</p>
          </footer>
        </div>
      </div>
    </MusicProvider>
  );
}

export default App;



