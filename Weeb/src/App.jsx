import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Articles from './pages/Articles';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b1220] to-[#0a0f1c] text-white pt-5 font-roboto">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/articles/*" element={<Articles />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
