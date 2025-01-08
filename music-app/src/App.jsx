import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer";
import { MusicProvider } from "./context/MusicContext";
import Callback from "./components/CallbackPage.jsx";

function App() {
  return (
    <Router>
      <MusicProvider>
        <div className="m-5">
          {/*<h1 className="text-center">🎵 Musices 🎵</h1>*/}

          <Routes>
            {/* Main Music Player Page */}
            <Route path="/" element={<MusicPlayer />} />
            {/* Add other routes as necessary */}
          </Routes>
        </div>
      </MusicProvider>
    </Router>
  );
}

export default App;
