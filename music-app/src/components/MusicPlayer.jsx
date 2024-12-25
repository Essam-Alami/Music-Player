import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "./ui/slider";
import { useMusic } from '../context/MusicContext';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const { currentSong, setCurrentSong, library, setLibrary } = useMusic();

  const audioRef = useRef(null);

  // Load saved songs from localStorage on initial load
  useEffect(() => {
    const savedLibrary = JSON.parse(localStorage.getItem("musicLibrary")) || [];
    if (savedLibrary.length > 0) {
      setLibrary(savedLibrary);
      setCurrentSong(savedLibrary[0]);
    }
  }, [setLibrary, setCurrentSong]);

  // Save the library to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("musicLibrary", JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log("Loading song:", currentSong.audio);
      audioRef.current.src = currentSong.audio;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Playback error:", err));
      }
    }
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch((err) => console.error("Playback error:", err));
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

  const AddSongForm = () => {
    const [newSong, setNewSong] = useState({
      title: "",
      artist: "",
      album: "",
      cover: "",
      audio: null,
    });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "audio") {
        setNewSong({ ...newSong, audio: files[0] });
      } else {
        setNewSong({ ...newSong, [name]: value });
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newSong.audio) {
        const audioUrl = URL.createObjectURL(newSong.audio);
        console.log("Generated audio URL:", audioUrl);
        const updatedSong = { ...newSong, audio: audioUrl };
        const updatedLibrary = [...library, updatedSong];
        setLibrary(updatedLibrary);
        setCurrentSong(updatedSong);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="artist" placeholder="Artist" onChange={handleChange} required />
        <input name="album" placeholder="Album" onChange={handleChange} required />
        <input name="cover" placeholder="Cover URL" onChange={handleChange} required />
        <input name="audio" type="file" accept="audio/*" onChange={handleChange} required />
        <button type="submit">Add Song</button>
      </form>
    );
  };

  const SongLibrary = () => {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold">Song Library</h3>
        <ul className="list-disc list-inside">
          {library.map((song, index) => (
            <li
              key={index}
              onClick={() => setCurrentSong(song)}
              className="cursor-pointer hover:underline"
            >
              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={(e) => console.error("Audio error:", e.target.error)}
        controls
      />

      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 100)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => console.log("Previous clicked")}> 
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
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => console.log("Next clicked")}> 
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

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

      <AddSongForm />
      <SongLibrary />
    </div>
  );
};

export default MusicPlayer;








