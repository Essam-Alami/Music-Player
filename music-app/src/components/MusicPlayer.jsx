import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';
import JSZip from 'jszip'; // Add JSZip for creating library zip downloads
import { saveAs } from 'file-saver'; // For downloading files
import './MusicPlayer.css';
import { debounce } from 'lodash';

const MusicPlayer = () => {
  const {
    library,
    currentSong,
    setCurrentSong,
    addSong,
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
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album || 'Unknown Album',
        artwork: currentSong.coverArt
          ? [{ src: currentSong.coverArt, sizes: '96x96', type: 'image/png' }]
          : [{ src: '/default-cover.png', sizes: '96x96', type: 'image/png' }],
      });
  
      const playHandler = () => audioRef.current.play();
      const pauseHandler = () => audioRef.current.pause();
      const stopHandler = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      };
  
      navigator.mediaSession.setActionHandler('play', playHandler);
      navigator.mediaSession.setActionHandler('pause', pauseHandler);
      navigator.mediaSession.setActionHandler('stop', stopHandler);
  
      return () => {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
      };
    }
  }, [currentSong]);  


  useEffect(() => {
    return () => {
      library.forEach((song) => {
        if (song.url.startsWith('blob:')) {
          URL.revokeObjectURL(song.url);
        }
      });
    };
  }, [library]);
  

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


  const handleStop = () => {
    if (currentSong?.id !== song.id) {
      setCurrentSong(song);
    }
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
      url: URL.createObjectURL(file), // Create blob URL
    }));
  
    const updatedLibrary = [...library, ...newTracks];
    localStorage.setItem('library', JSON.stringify(updatedLibrary));
    setLibrary(updatedLibrary);
    if (!currentSong) {
      setCurrentSong(newTracks[0]); // Set the first uploaded track as the current song
    }
  };
  

  const handleDownloadTrack = (song) => {
    const link = document.createElement('a');
    link.href = song.url;
    link.download = `${song.title}.mp3`;
    link.click();
  };

  
  const handleDownloadLibrary = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder('MusicLibrary');
      const CHUNK_SIZE = 3;
  
      for (let i = 0; i < library.length; i += CHUNK_SIZE) {
        const chunk = library.slice(i, i + CHUNK_SIZE);
        const blobs = await Promise.all(
          chunk.map(async (song) => {
            const response = await fetch(song.url);
            return response.blob();
          })
        );
        blobs.forEach((blob, index) => {
          const song = chunk[index];
          folder.file(`${song.title}.mp3`, blob);
        });
      }
  
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'MusicLibrary.zip');
    } catch (error) {
      console.error('Library download failed:', error.message);
    }
  };  
  

  const handlePlaySong = (song) => {
    if (!song.url) {
      console.error('Invalid song URL for playback:', song.title);
      return;
    }
  
    if (currentSong?.id !== song.id) {
      setCurrentSong(song);
    }
  
    audioRef.current.src = song.url; // Set the audio source
    audioRef.current
      .play()
      .catch((err) => console.error('Playback error:', err.message));
  };
  
  

  const debouncedSetLibrary = debounce((library) => {
    localStorage.setItem('library', JSON.stringify(library));
    setLibrary(library);
  }, 500);
  
  const removeSong = (songId) => {
    setLibrary((prev) => {
      const updatedLibrary = prev.filter((song) => song.id !== songId);
      debouncedSetLibrary(updatedLibrary);
      return updatedLibrary;
    });
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
            <button onClick={handlePlaySong}>Play</button>
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
                aria-label="Volume Control"
       />
          <span>{Math.round(volume * 100)}%</span>
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
        <label htmlFor="handleUploadTracks">Upload Tracks To Library...</label><input type="file" accept=".mp3" multiple onChange={handleUploadTracks} />
        <button onClick={handleDownloadLibrary}>Download Entire Library</button>
      </div>
    </div>
       
  );
};

export default MusicPlayer;











