import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const AuthContext = createContext(null);

// API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };
    initAuth();
  }, []);

  // LOGIN
  const login = async (
    email,
    password
  ) => {

    setLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message:
            data.detail || 'Login failed',
        };
      }

      // SAVE TOKEN
      localStorage.setItem(
        'token',
        data.access_token
      );

      // FETCH USER DATA
      try {
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user on login:', err);
      }

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        'Login Error:',
        error
      );

      return {
        success: false,
        message:
          'Could not connect to server',
      };

    } finally {

      setLoading(false);
    }
  };

  // SIGNUP
  const signup = async (
    name,
    email,
    password
  ) => {

    setLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            username: name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        return {
          success: false,
          message:
            data.detail || 'Signup failed',
        };
      }

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        'Signup Error:',
        error
      );

      return {
        success: false,
        message:
          'Could not connect to server',
      };

    } finally {

      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      'token'
    );
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);