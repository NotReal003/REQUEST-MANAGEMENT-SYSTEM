import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const useAuth = () => {
  const [cookies] = useCookies(['jwt']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!cookies.jwt) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('https://f174c7ef-3543-40a2-bb8b-9aa0730bc042-00-1uxfjy0vfa4lx.pike.replit.dev/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [cookies.jwt]);

  return isAuthenticated;
};

export default useAuth;
