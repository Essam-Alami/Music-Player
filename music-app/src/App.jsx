import { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';

function App(MusicPlayer) {


  return (
     <Router>
      <div className="MusicPlayer">
        <Routes>
          <Route path="/src/components/Player.jsx" element={Spotify.Player} />
        </Routes>
      </div>
     </Router>
  );
}

export default App
