import  { createContext, useContext, useState } from 'react';
import { fetchLibrary, addToLibrary } from '../api/musicApi';


const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [library, setLibrary] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [error, setError] = useState(null);

  const loadLibrary = async () => {
    try {
      const data = await fetchLibrary();
      setLibrary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const addSong = async (song) => {
    try {
      await addToLibrary(song); // Sync with server
      setLibrary((prev) => [...prev, song]);
    } catch (err) {
      console.error('Error adding song:', err.message);
      setError(err.message);
    }
  };

  const removeSong = (songId) => {
    setLibrary((prev) => {
      const updatedLibrary = prev.filter((song) => song.id !== songId);
      localStorage.setItem('library', JSON.stringify(updatedLibrary));
      return updatedLibrary;
    });
  };
  

  const nextSong = () => {
    if (currentIndex < library.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSong(library[currentIndex + 1]);
    }
  };

  const previousSong = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSong(library[currentIndex - 1]);
    }
  };

  return (
    <MusicContext.Provider
    value={{
      library,
      currentSong,
      error,
      setCurrentSong,
      addSong,
      removeSong,
      nextSong,
      previousSong,
      loadLibrary,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
