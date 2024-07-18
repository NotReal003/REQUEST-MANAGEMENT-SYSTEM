import React, { useEffect } from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Support from './pages/Support';
import Apply from './pages/Apply';
import NotFound from './pages/404';

const App = () => {
  const [token, setToken] = useState(document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1]);

  useEffect(() => {
    if (!token) {
      window.location.href = 'https://f174c7ef-3543-40a2-bb8b-9aa0730bc042-00-1uxfjy0vfa4lx.pike.replit.dev/auth/discord';
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/support" element={<Support />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
