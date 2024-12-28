import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';
import JSZip from 'jszip'; // Add JSZip for creating library zip downloads
import { saveAs } from 'file-saver'; // For downloading files
import './MusicPlayer.css';


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
      console.error('Search failed:', err.message);
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
    setCurrentSong(updatedLibrary[0]); // Set the first uploaded track as the current song
    setLibrary(updatedLibrary);
  };

  const handleDownloadTrack = (song) => {
    const link = document.createElement('a');
    link.href = song.url;
    link.download = `${song.title}.mp3`;
    link.click();
  };

  const handleDownloadLibrary = async () => {
    const zip = new JSZip();
    const folder = zip.folder('MusicLibrary');

    library.forEach((song, index) => {
      folder.file(`${song.title}-${index}.mp3`, fetch(song.url).then((res) => res.blob()));
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'MusicLibrary.zip');
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
            <button onClick={() => setCurrentSong(song)}>Play</button>
            <button onClick={() => removeSong(song.id)}>Remove</button>
            <button onClick={() => handleDownloadTrack(song)}>Download</button>
          </div>
        ))}
      </div>
      <div className="library-management">
        <input type="file" accept=".mp3" multiple onChange={handleUploadTracks} />
        <button onClick={handleDownloadLibrary}>Download Entire Library</button>
      </div>
    </div>
  );
};

export default MusicPlayer;











