import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Support from './pages/Support';
import Apply from './pages/Apply';
import NotFound from './pages/404';
import Login from './pages/Login';
import Success from './pages/Success';
import One from './pages/One';
import Admin from './pages/Admin';
import RequestDetail from './pages/RequestDetail';
import AdminDetail from './pages/AdminDetail';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New state to manage loading

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callback');
    if (callback) {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        setIsAuthenticated(true);
      }
    }
    setLoading(false); // Set loading to false after token check
  }, []);

  if (loading) {
    return <div className="loading loading-spinner text-info"></div>; // Show a loading state while checking token
  }

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
            <Route path="/Success" element={isAuthenticated ? <Success /> : <Navigate to="/login" />} />
            <Route path="/One" element={isAuthenticated ? <One /> : <Navigate to="/login" />} />
            <Route path="/Admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/RequestDetail" element={isAuthenticated ? <RequestDetail /> : <Navigate to="/login" />} />
            <Route path="/AdminDetail" element={isAuthenticated ? <AdminDetail /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
