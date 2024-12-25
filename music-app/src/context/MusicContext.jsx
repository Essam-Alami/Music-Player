import React, { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [library, setLibrary] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  
  const addSong = (song) => {
    setLibrary(prev => [...prev, song]);
  };

  const addToPlaylist = (playlistId, song) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, songs: [...playlist.songs, song] }
        : playlist
    ));
  };

  const removeSong = (songId) => {
    setLibrary(prev => prev.filter(song => song.id !== songId));
  };

  return (
    <MusicContext.Provider value={{
      library,
      currentSong,
      playlists,
      setCurrentSong,
      addSong,
      removeSong,
      addToPlaylist
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);