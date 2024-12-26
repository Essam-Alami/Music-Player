import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Search } from 'lucide-react';
import { Slider } from "./ui/Slider";
import { useMusic } from '../context/MusicContext';
import { searchSongs } from '../api/musicApi';

const MusicPlayer = () => {
  const {
    currentSong,
    setCurrentSong,
    library,
    addSong,
    nextSong,
    previousSong
  } = useMusic();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play().catch(err => setError('Playback failed: ' + err.message));
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handleSearch = async () => {
    try {
      setError(null);
      console.log('Searching for:', searchQuery); // Debugging
      const results = await searchSongs(searchQuery);
      console.log('Search results:', results); // Verify format
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err.message);
      setError(`Search failed: ${err.message}`);
    }
  };
  

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(err => setError('Playback failed: ' + err.message));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleError = (e) => {
    setError(`Audio error: ${e.target.error?.message || 'Unknown error'}`);
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 border rounded p-4">
            <h3 className="font-bold mb-2">Search Results</h3>
            <ul>
              {searchResults.map(song => (
                <li
                  key={song.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setCurrentSong(song)}
                >
                  <span>{song.title} - {song.artist}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addSong(song);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Add to Library
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
        />

        {currentSong ? (
          <>
            <div className="flex items-center mb-6">
              <img
                src={currentSong.coverArt}
                alt="Album cover"
                className="w-20 h-20 rounded-lg shadow-md"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{currentSong.title}</h2>
                <p className="text-gray-600">{currentSong.artist}</p>
                <p className="text-gray-500 text-sm">{currentSong.album}</p>
              </div>
            </div>

            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={([value]) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = value;
                    setCurrentTime(value);
                  }
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={previousSong}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => handleVolumeChange(value)}
                  className="w-24"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Select a song to play
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;








