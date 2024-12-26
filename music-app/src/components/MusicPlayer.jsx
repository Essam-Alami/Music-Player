import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';
import { Play, Pause, SkipForward, SkipBack, Search } from 'lucide-react';

const MusicPlayer = () => {
  const { library, currentSong, setCurrentSong, addSong, nextSong, previousSong, loadLibrary } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play().catch((err) => setError('Playback failed: ' + err.message));
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
          <audio ref={audioRef} controls />
          <button onClick={previousSong}>Previous</button>
          <button onClick={nextSong}>Next</button>
        </div>
      )}

      <h3>Your Library</h3>
      {library.map((song) => (
        <div key={song.id}>
          <span>{song.title} by {song.artist}</span>
        </div>
      ))}
    </div>
  );
};

export default MusicPlayer;








