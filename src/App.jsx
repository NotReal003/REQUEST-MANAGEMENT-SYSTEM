import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Support from './pages/Support';
import Apply from './pages/Apply';
import NotFound from './pages/404';
import Login from './pages/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getTokenFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    };

    const token = getTokenFromUrl();
    if (token) {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, '/'); // Remove token from URL
    } else {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route exact path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/report" element={isAuthenticated ? <ReportForm /> : <Navigate to="/login" />} />
            <Route path="/support" element={isAuthenticated ? <Support /> : <Navigate to="/login" />} />
            <Route path="/apply" element={isAuthenticated ? <Apply /> : <Navigate to="/login" />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
