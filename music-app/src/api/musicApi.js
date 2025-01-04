const BASE_URL = 'https://spotify23.p.rapidapi.com';

const API_HEADERS = {
  'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY, // Or process.env.REACT_APP_RAPIDAPI_KEY
  'x-rapidapi-host': 'spotify23.p.rapidapi.com',
};

// Utility function for throttling
let lastCallTime = 0;
function throttle(func, limit) {
  return async (...args) => {
    const now = Date.now();
    if (now - lastCallTime >= limit) {
      lastCallTime = now;
      return await func(...args);
    } else {
      console.warn('Throttled function call');
    }
  };
}

const EXPRESS_SERVER_URL = 'http://localhost:5173/library';

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
    return data.tracks.items.map((track) => ({
      id: track.data.id,
      title: track.data.name,
      artist: track.data.artists.items.map((artist) => artist.profile.name).join(', '),
      album: track.data.albumOfTrack.name,
      url: track.data.uri,
      coverArt: track.data.albumOfTrack.coverArt.sources[0]?.url,
    }));
  } catch (error) {
    console.error('Search error:', error.message);
    throw error;
  }
}

// Add a song to local storage and sync with Express server
export async function addToLibrary(song) {
  try {
    const localLibrary = JSON.parse(localStorage.getItem('library')) || [];
    const updatedLibrary = [...localLibrary, song];
    localStorage.setItem('library', JSON.stringify(updatedLibrary)); // Save locally

    console.log('Syncing song with Express server...');
    const response = await fetch(EXPRESS_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song),
    });
    if (!response.ok) throw new Error(`Failed to add song with status ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Add to library error:', error.message);
    throw error;
  }
}


// State to track if the library has been successfully fetched
let libraryFetched = false;

// Fetch library from local storage or Express server
export async function fetchLibrary() {
  try {
    console.log('Fetching library from local storage...');
    const localLibrary = JSON.parse(localStorage.getItem('library'));
    if (localLibrary && localLibrary.length > 0) {
      console.log('Library loaded from local storage.');
      return localLibrary;
    }

    console.log('Fetching library from Express server...');
    const response = await fetch(EXPRESS_SERVER_URL, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(`Failed to fetch library with status ${response.status}`);
    const library = await response.json();
    localStorage.setItem('library', JSON.stringify(library)); // Cache in local storage
    return library;
  } catch (error) {
    console.error('Fetch library error:', error.message);
    return [];
  }
}



// Throttled versions of the functions
export const throttledFetchLibrary = throttle(fetchLibrary, 5000); // 5 seconds
export const throttledAddToLibrary = throttle(addToLibrary, 3000); // 3 seconds

// Exporting the updated functions
export default {
  searchSongs,
  addToLibrary: throttledAddToLibrary,
  fetchLibrary: throttledFetchLibrary,
};


 

