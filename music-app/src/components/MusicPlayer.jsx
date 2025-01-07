import { useState, useEffect } from "react";
import { useMusic } from "../context/MusicContext";
import { searchSongsFromSpotify } from "../api/musicApi";
import { getSpotifyAccessToken } from "../configs/spotify_functions";

const MusicPlayer = () => {
  const { setCurrentSong, addSong, removeSong } = useMusic();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
  const libraryFromLocalStorage = JSON.parse(localStorage.getItem("library"));
  const [musicLibrary, setMusicLibrary] = useState(libraryFromLocalStorage || []);
  const [currentSpotifyTrackId, setCurrentSpotifyTrackId] = useState(null);

  // Initialize Spotify Player
  useEffect(() => {
    const fetchSpotifyKey = async () => {
      const token = await getSpotifyAccessToken();
      setSpotifyAccessToken(token);
    };

    fetchSpotifyKey();
  }, []);

  // Handle Search
  const handleSearch = async () => {
    try {
      setError(null);
      const results = await searchSongsFromSpotify(searchQuery, spotifyAccessToken);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err.message);
      setError(`Search failed: ${err.message}`);
    }
  };

  // Add song to library
  const addSongToLibrary = (song) => {
    addSong(song);
    setMusicLibrary((prev) => [...prev, song]);
  };

  // Remove song from library
  const removeSongFromLibrary = (songId) => {
    removeSong(songId);
    setMusicLibrary((prev) => prev.filter((song) => song.id !== songId));
  };

  // Handle Play Button Click
  const playSong = (trackId) => {
    setCurrentSpotifyTrackId(trackId);
  };

  return (
      <div className="bg-gray-900 text-white min-h-screen font-sans rounded-lg">
        {/* Now Playing Section */}
        <header className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 shadow-lg ">
          <h1 className="text-3xl font-bold text-center">&copy; Musices</h1>
          {currentSpotifyTrackId && (
              <div className="mt-6 flex justify-center">
                <iframe
                    src={`https://open.spotify.com/embed/track/${currentSpotifyTrackId}`}
                    frameBorder="0"
                    className="w-full max-w-lg h-20 rounded-lg shadow-md"
                    allow="encrypted-media"
                ></iframe>
              </div>
          )}
        </header>

        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
            )}

            <h2 className="text-xl font-semibold mb-4">Search Songs</h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-purple-400"
              />
              <button
                  onClick={handleSearch}
                  className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg"
              >
                Search
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            <div className="space-y-4">
              {searchResults.map((song) => (
                  <div
                      key={song.id}
                      className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <img
                          className="h-16 w-16 rounded-lg"
                          src={song.coverArt}
                          alt={song.title}
                      />
                      <div>
                        <p className="font-bold text-lg">{song.title}</p>
                        <p className="text-sm text-gray-300">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                          onClick={() => playSong(song.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Play
                      </button>
                      <button
                          onClick={() => addSongToLibrary(song)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Music Library Section */}
          {musicLibrary && musicLibrary.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your Music Library</h2>
                <div className="space-y-4">
                  {musicLibrary.map((song) => (
                      <div
                          key={song.id}
                          className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <img
                              className="h-16 w-16 rounded-lg"
                              src={song.coverArt}
                              alt={song.title}
                          />
                          <div>
                            <p className="font-bold text-lg">{song.title}</p>
                            <p className="text-sm text-gray-300">{song.artist}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                              onClick={() => playSong(song.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Play
                          </button>
                          <button
                              onClick={() => removeSongFromLibrary(song.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        <footer className={"m-5 p-4 text-center"}>
          <p>&copy; 2024 - All Rights Reserved</p>
        </footer>
      </div>
  );
};

export default MusicPlayer;
