const scopes = [
    "user-modify-playback-state",
    "user-read-playback-state",
    "streaming",
].join(' ');

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Redirect the user to the Spotify Authorization Page
export const redirectToSpotifyAuth = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${generateRandomString(16)}`;
    window.location.href = authUrl; // Redirect the user to Spotify's login page
};


// Fetch Spotify Access Token using the Authorization Code
export const fetchSpotifyAccessToken = async (authCode) => {
    if (!clientId || !clientSecret) {
        console.error("Spotify client ID and client secret are required");
        return null;
    }

    const encodedCredentials = btoa(`${clientId}:${clientSecret}`); // Base64 encode client credentials

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: authCode,
                redirect_uri: redirectUri,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            // Save the access token and expiry in cookies
            document.cookie = `spotify_access_token=${data.access_token}; path=/; max-age=3600; secure`;
            document.cookie = `spotify_refresh_token=${data.refresh_token}; path=/; secure`;
            document.cookie = `spotify_token_expiry=${Date.now() + data.expires_in * 1000}; path=/; secure`;
            return data.access_token;
        } else {
           const errorData = await response.json();
           console.error("Failed to fetch Spotify access token:", errorData);
        }
    } catch (error) {
        console.error("Error fetching Spotify access token:", error);
        return null;
    }
};

// Refresh the Spotify Access Token
export const refreshSpotifyAccessToken = async () => {
    const refreshToken = getCookie("spotify_refresh_token");

    if (!refreshToken) {
        console.log("No refresh token available, redirecting to login...");
        redirectToSpotifyAuth(); // Redirect to the Spotify login page for a new token
        return null; // Do not proceed further
    }

    const encodedCredentials = btoa(`${clientId}:${clientSecret}`); // Base64 encode client credentials

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            // Update the access token and expiry in cookies
            document.cookie = `spotify_access_token=${data.access_token}; path=/; max-age=3600; secure`;
            document.cookie = `spotify_token_expiry=${Date.now() + data.expires_in * 1000}; path=/; secure`;
            return data.access_token;
        } else {
            throw new Error("Failed to refresh access token");
        }
    } catch (error) {
        console.error("Error refreshing Spotify access token:", error);
        return null;
    }
};

// Get Spotify Access Token (check expiry and refresh if needed)
export const getSpotifyAccessToken = async () => {
    const token = getCookie("spotify_access_token");
    const expiryTime = parseInt(getCookie("spotify_token_expiry"), 10);

    if (token && Date.now() < expiryTime) {
        // Token is valid
        return token;
    } else if (!token) {
        // No token found, redirect
        console.log("Access token not found, redirecting to login...");
        redirectToSpotifyAuth(); // Redirect to Spotify login
        return null; // Do not proceed further
    } else {
        // Token is expired or does not exist, refresh or fetch a new one
        return await refreshSpotifyAccessToken();
    }
};

// Helper to generate a random string for state or other needs
const generateRandomString = (length) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length })
        .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
        .join("");
};

// Helper to retrieve a specific cookie value
const getCookie = (name) => {
    const cookies = document.cookie.split("; ").map((cookie) => cookie.trim());
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
};
