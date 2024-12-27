import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import { MusicProvider } from './context/MusicContext';
import './App.css'; // Import CSS for styling

function App() {
  return (
    <MusicProvider>
      <div className="app">
        <div className="container">
          <h1>Music Player</h1>
          <MusicPlayer />
          <footer>
            <h6 style={{ marginTop: '20px', textAlign: 'center' }}>
              Copyright 2024
            </h6>
          </footer>
        </div>
      </div>
    </MusicProvider>
  );
}

export default App;



