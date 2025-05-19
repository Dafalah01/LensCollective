import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import GroupDetail from './pages/GroupDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;