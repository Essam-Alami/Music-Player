window.onSpotifyWebPlaybackSDKReady = () => {
  const token = '[BQDIy4qMvSzZ2iBj3gn-6A6IF2BjRIQ65F_dG3mZqVJ7-dZ7aAgvNKowzoQCSaBcnNF0RJk11he3rMO6fxkkgC0GTsYVTRjcoWxxQryCmVA5sRTdWwE_wFbNvjf_wDOb1IR7qHvS4PbZXsivI6kuJjm7JyBgw_tYvxLnGsjWWKWmLSYYqInqTWZXJQOuD5XfRK5shLFP5EcXeyOgF2XQQrMbGbMJtNjS18AczKVE1J12BzEFBkNzr9vS9FvhvwMfSACqBDI0zeui0C_5k881-DCAYDv7EHShitAmsZfHdPouKcOy1QRdWmWQqoCFXwFvIBzp5g8uO8rOrtt7W431q6-GdUU]';
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
})};

export default App
