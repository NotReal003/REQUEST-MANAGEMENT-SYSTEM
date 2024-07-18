// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Support from './pages/Support';
import Apply from './pages/Apply';
import NotFound from './pages/404';
import useAuth from './hooks/useAuth';

const App = () => {
  const [cookies] = useCookies(['jwt']);
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !window.location.pathname.startsWith('https://f174c7ef-3543-40a2-bb8b-9aa0730bc042-00-1uxfjy0vfa4lx.pike.replit.dev/auth/discord/callback')) {
      window.location.href = 'https://f174c7ef-3543-40a2-bb8b-9aa0730bc042-00-1uxfjy0vfa4lx.pike.replit.dev/auth/discord'; // Redirect to Discord auth page if not authenticated
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/support" element={<Support />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/auth/discord/callback" element={<DiscordCallback />} />
        </Routes>
      </div>
    </Router>
  );
};

const DiscordCallback = () => {
  const [cookies, setCookie] = useCookies(['jwt']);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const fetchToken = async () => {
      try {
        const response = await fetch(`https://api.notreal003.xyz/auth/discord/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCookie('jwt', data.token, { path: '/' });
          window.location.href = '/';
        } else {
          console.error('Failed to authenticate');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    if (code) {
      fetchToken();
    } else {
      console.error('No code found in URL');
    }
  }, [setCookie]);

  return <div>Authenticating...</div>;
};

export default App;
