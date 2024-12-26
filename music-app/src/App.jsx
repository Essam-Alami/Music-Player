import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import { MusicProvider } from './context/MusicContext';

function App() {
  // Debugging logs to confirm App renders
  console.log('App rendering...');
  console.log('App is rendered.')

  return (
    <MusicProvider>
      <div className="app">
        <div className="container">
          {/* Added a fallback UI and loading indicator for debugging */}
          <h1>Spotify Music Player</h1>
          <MusicPlayer />
          <footer>
            <h6 style={{ marginTop: '20px', textAlign: 'center' }}>
              Debugging Spotify Music Player.....
            </h6>
          </footer>
        </div>
      </div>
    </MusicProvider>
  );
}

export default App;


