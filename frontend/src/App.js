import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from "react-redux"
import Signup from './Screens/SignUp';
import Home from './Screens/Home';
import Sidebar from './Components/Sidebar';
import MusicPlayer from './Components/MusicPlayer';
import PlaylistWrapper from './Screens/PlaylistWrappers';
import Search from './Screens/Search';
import PlaylistManager from './Screens/PlaylistManager';
import AddSongs from './Screens/AddSongs';
import Login from './Screens/Login';

function Layout() {
  const { isPlayerVisible } = useSelector((state) => state.nowPlaying);
  return (
    <div className="main-layout" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="page-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/artist/:id" element = {<PlaylistWrapper />} />
          <Route path="/beatx/:id" element = {<PlaylistWrapper />} />
          <Route path="/likedSongs" element = {<PlaylistWrapper />} />
          <Route path="/search" element = {<Search />} />
          <Route path="/myPlaylists" element = {<PlaylistManager />} />
          <Route path="/playlist/:id" element = {<PlaylistWrapper />} />
          <Route path="/addSongs/:id" element = {<AddSongs />} />
        </Routes>
      </div>
      {isPlayerVisible && <MusicPlayer />}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes (without sidebar) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Routes with sidebar */}
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
