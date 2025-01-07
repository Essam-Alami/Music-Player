import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchSpotifyAccessToken} from "../configs/spotify_functions.ts"; // Import useNavigate hook

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        if (code) {
            // Now, use the `code` to fetch the access token
            fetchSpotifyAccessToken(code)
                .then(() => {
                    // Once the token is fetched, you can redirect the user to another page
                    navigate('/'); // Redirect to your main page or dashboard
                })
                .catch((error) => {
                    console.error('Error fetching Spotify access token:', error);
                });
        }
    }, [navigate]);

    return (
        <div>
            <h1>Processing Spotify Login...</h1>
            {/* You can show a loading spinner or message here */}
        </div>
    );
};

export default Callback;
