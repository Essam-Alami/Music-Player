import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import { MusicProvider } from './context/MusicContext';

function App() {
  console.log('App rendering...');
  return (
<ErrorBoundary>
  <MusicProvider>
    <div className="app">
      <div className="container">
        <h1>Spotify Music Player</h1>
        <MusicPlayer />
      </div>
    </div>
  </MusicProvider>
</ErrorBoundary>

  );
}

export default App;

