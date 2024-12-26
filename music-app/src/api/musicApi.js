const BASE_URL = 'https://api.example.com/music';

export async function searchSongs(query) {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${query}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    throw new Error(`Search error: ${error.message}`);
  }
}

export async function fetchLibrary() {
  try {
    const response = await fetch(`${BASE_URL}/library`);
    if (!response.ok) throw new Error('Failed to fetch library');
    return await response.json();
  } catch (error) {
    throw new Error(`Library fetch error: ${error.message}`);
  }
}

export async function addToLibrary(song) {
  try {
    const response = await fetch(`${BASE_URL}/library`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song)
    });
    if (!response.ok) throw new Error('Failed to add song');
    return await response.json();
  } catch (error) {
    throw new Error(`Add song error: ${error.message}`);
  }
}