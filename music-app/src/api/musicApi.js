const BASE_URL = 'https://spotify23.p.rapidapi.com';

const API_HEADERS = {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY, // Updated for Vite
    'x-rapidapi-host': 'spotify23.p.rapidapi.com'
};

export async function searchSongs(query) {
    try {
      const response = await fetch(`${BASE_URL}/search/?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=10`, {
        method: 'GET',
        headers: API_HEADERS
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied: Invalid API key or insufficient permissions');
        }
        throw new Error(`Search failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.tracks.items.map(track => ({
        id: track.data.id,
        title: track.data.name,
        artist: track.data.artists.items.map(artist => artist.profile.name).join(', '),
        album: track.data.albumOfTrack.name,
        url: track.data.preview_url,
        coverArt: track.data.albumOfTrack.coverArt.sources[0]?.url
      }));
    } catch (error) {
      console.error('Search error:', error.message);
      throw new Error(`Search error: ${error.message}`);
    }
  }
  

export async function addToLibrary(song) {
    try {
        const response = await fetch(`${BASE_URL}/library`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(song),
        });
        if (!response.ok) throw new Error(`Failed to add song with status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Add to library error:', error.message);
        throw error;
    }
}

export async function fetchLibrary() {
    try {
        const response = await fetch(`${BASE_URL}/library`, {
            method: 'GET',
            headers: API_HEADERS,
        });
        if (!response.ok) throw new Error(`Failed to fetch library with status ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch library error:', error.message);
        throw error;
    }
}

export default { searchSongs, addToLibrary, fetchLibrary};



  

