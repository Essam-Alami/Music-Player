// Function to fetch the Spotify access token
export const fetchSpotifyAccessToken = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Spotify client ID and client secret are required");
    return;
  }

  // Base64 encode the client ID and client secret
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const expirationTime = Date.now() + 3600 * 1000; // 1 hour expiry

      // Set access token and expiry time in cookies
      document.cookie = `spotify_access_token=${data.access_token}; path=/; max-age=3600; secure; HttpOnly; SameSite=Strict`;
      document.cookie = `spotify_token_expiry=${expirationTime}; path=/; max-age=3600; secure; HttpOnly; SameSite=Strict`;

      return data.access_token;
    } else {
      throw new Error("Failed to fetch access token");
    }
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
  }
};

// Function to retrieve the access token, refreshing it if expired
export const getSpotifyAccessToken = async () => {
  const cookies = document.cookie.split("; ").map((cookie) => cookie.trim());

  // Retrieve the token and expiry time from cookies
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("spotify_access_token=")
  );
  const expiryCookie = cookies.find((cookie) =>
    cookie.startsWith("spotify_token_expiry=")
  );

  const token = tokenCookie ? tokenCookie.split("=")[1] : null;
  const expiryTime = expiryCookie
    ? parseInt(expiryCookie.split("=")[1], 10)
    : 0;

  // Check if the token exists and is still valid
  if (token && Date.now() < expiryTime) {
    return token; // Return the valid token
  } else {
    // Token is expired or doesn't exist, fetch a new one
    return await fetchSpotifyAccessToken();
  }
};
