const BASE_URL = 'https://spotify23.p.rapidapi.com';

const API_HEADERS = {
  'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY, // Or process.env.REACT_APP_RAPIDAPI_KEY
  'x-rapidapi-host': 'spotify23.p.rapidapi.com',
};

// Search for songs via the API
export async function searchSongs(query) {
  try {
    console.log('Searching for songs:', query);
    const response = await fetch(`${BASE_URL}/search/?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=10`, {
      method: 'GET',
      headers: API_HEADERS,
    });
    if (!response.ok) throw new Error(`Search failed with status ${response.status}`);
    const data = await response.json();
    return data.tracks.items.map((track, index) => ({
      id: track.data.id || `${track.data.name}-${index}`, // Fallback id
      title: track.data.name,
      artist: track.data.artists.items.map((artist) => artist.profile.name).join(', '),
      album: track.data.albumOfTrack.name,
      url: track.data.preview_url,
      coverArt: track.data.albumOfTrack.coverArt.sources[0]?.url,
    }));
    
  } catch (error) {
    console.error('Search error:', error.message);
    throw error;
  }
}

// Add a song to the library
export async function addToLibrary(song) {
  try {
    console.log('Adding song to library:', song);
    const localLibrary = JSON.parse(localStorage.getItem('library')) || [];
    const updatedLibrary = [...localLibrary, song];
    localStorage.setItem('library', JSON.stringify(updatedLibrary));
    return song;
  } catch (error) {
    console.error('Add to library error:', error.message);
    throw error;
  }
}

// Fetch library
export async function fetchLibrary() {
  try {
    console.log('Fetching library from local storage...');
    return JSON.parse(localStorage.getItem('library')) || [];
  } catch (error) {
    console.error('Fetch library error:', error.message);
    return [];
  }
}


// Export all functions
export default { searchSongs, addToLibrary, fetchLibrary };


 

