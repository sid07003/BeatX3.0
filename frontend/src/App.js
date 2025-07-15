import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Screens/SignUp';
import Sidebar from './Components/Sidebar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Sidebar />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;