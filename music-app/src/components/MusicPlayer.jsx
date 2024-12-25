import React, { useState, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "./ui/slider";
import { useMusic } from '../context/MusicContext';
import { currentSong, library} from '../assets'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const { currentSong, setCurrentSong, library } = useMusic();

  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const playNextSong = () => {
    const currentIndex = library.findIndex((song) => song.title === currentSong.title);
    const nextIndex = (currentIndex + 1) % library.length;
    setCurrentSong(library[nextIndex]);
  };

  const playPreviousSong = () => {
    const currentIndex = library.findIndex((song) => song.title === currentSong.title);
    const prevIndex = (currentIndex - 1 + library.length) % library.length;
    setCurrentSong(library[prevIndex]);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        src={currentSong.audio} // Dynamic song source
      />
      
      {/* Album Art and Info */}
      <div className="flex items-center mb-6">
        <img 
          src={currentSong.cover} 
          alt="Album cover" 
          className="w-20 h-20 rounded-lg shadow-md"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold">{currentSong.title}</h2>
          <p className="text-gray-600">{currentSong.artist}</p>
          <p className="text-gray-500 text-sm">{currentSong.album}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={playPreviousSong}>
            <SkipBack className="w-6 h-6" />
          </button>
          <button 
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={playNextSong}>
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={toggleMute}
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
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;