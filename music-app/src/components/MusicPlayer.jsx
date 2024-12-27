import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';

const MusicPlayer = () => {
  const {
    library,
    currentSong,
    setCurrentSong,
    addSong,
    removeSong,
    nextSong,
    previousSong,
    loadLibrary,
  } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (currentSong && currentSong.url) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play().catch((err) => setError('Playback failed: ' + err.message));
    } else {
      setError('No playable URL for the current song.');
    }
  }, [currentSong]);

  const handleSearch = async () => {
    try {
      setError(null);
      const results = await searchSongs(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err.message);
      setError(`Search failed: ${err.message}`);
    }
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search songs..."
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.map((song) => (
        <div key={song.id}>
          <span>{song.title} by {song.artist}</span>
          <button onClick={() => addSong(song)}>Add to Library</button>
        </div>
      ))}

      {currentSong && (
        <div>
          <h3>Now Playing: {currentSong.title} by {currentSong.artist}</h3>
          {currentSong.url ? (
            <audio ref={audioRef} controls />
          ) : (
            <p>No playback URL available for this track.</p>
          )}
        </div>
      )}

      <h3>Your Library</h3>
      {library.map((song) => (
        <div key={song.id}>
          <span>{song.title} by {song.artist}</span>
          <button onClick={() => handlePlaySong(song)}>Play</button>
          <button onClick={() => removeSong(song.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default MusicPlayer;








