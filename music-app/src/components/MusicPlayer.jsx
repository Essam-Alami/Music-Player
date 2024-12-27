import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';
import './MusicPlayer.css'; // Import CSS for styling

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
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (currentSong && currentSong.url) {
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
      setError(`Search failed: ${err.message}`);
    }
  };

  const handlePlay = () => {
    audioRef.current.play();
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
  };

  const handleUploadTracks = (e) => {
    const files = Array.from(e.target.files);
    const newTracks = files.map((file, index) => ({
      id: `${file.name}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      artist: 'Unknown',
      album: 'Unknown',
      url: URL.createObjectURL(file),
    }));

    const updatedLibrary = [...library, ...newTracks];
    localStorage.setItem('library', JSON.stringify(updatedLibrary));
  };

  const handleDownloadTrack = (song) => {
    const link = document.createElement('a');
    link.href = song.url;
    link.download = `${song.title}.mp3`;
    link.click();
  };

  return (
    <div className="music-player">
      {error && <div className="error">{error}</div>}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results">
        {searchResults.map((song) => (
          <div className="song-item" key={song.id}>
            <span>{song.title} by {song.artist}</span>
            <button onClick={() => addSong(song)}>Add to Library</button>
          </div>
        ))}
      </div>

      {currentSong && (
        <div className="now-playing">
          <h3>Now Playing: {currentSong.title} by {currentSong.artist}</h3>
          <audio ref={audioRef} controls />
          <div className="controls">
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
            <div className="volume-control">
              <label>Volume:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}

      <h3>Your Library</h3>
      <div className="library">
        {library.map((song) => (
          <div className="song-item" key={song.id}>
            <span>{song.title} by {song.artist}</span>
            <button onClick={() => handlePlaySong(song)}>Play</button>
            <button onClick={() => removeSong(song.id)}>Remove</button>
            <button onClick={() => handleDownloadTrack(song)}>Download</button>
          </div>
        ))}
        <div>
        <h3>Library Management</h3>
        <input type="file" accept=".mp3" multiple onChange={handleUploadTracks} />
      </div>
      </div>
    </div>
  );
};

export default MusicPlayer;











