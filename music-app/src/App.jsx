import { useState } from 'react';
import './App.css';
import Player from '../Player';

function App() {


  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/src/components/Player.jsx" element={Spotify.Player} />
        </Routes>
      </div>
     </Router>
  );
}

export default App
