import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface LocationState {
  from?: Location;
  sessionExpired?: boolean;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/dashboard';
  const sessionExpired = locationState?.sessionExpired;

  useEffect(() => {
    // If the user is already logged in, redirect them
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    try {
      await login(username, password);
    } catch (err) {
      // The error handling is done in the AuthContext, this catch block is just for unexpected errors
      console.error('Unexpected login error:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A2463] to-[#143594] flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="mx-auto h-16 w-16 text-[#E6AF2E]" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-bold text-white">
          Branch Access Manager
        </h2>
        <p className="mt-2 text-center text-md text-gray-200">
          Authentication required for branch managers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
          {sessionExpired && (
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your session has expired for security reasons. Please log in again.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0A2463] focus:border-[#0A2463] sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0A2463] focus:border-[#0A2463] sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {formError && (
              <div className="text-sm text-red-600">{formError}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A2463] hover:bg-[#143594] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] transition-colors duration-200 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="small" color="#ffffff" />
                    <span className="ml-2">Authenticating...</span>
                  </span>
                ) : (
                  'Sign in with Active Directory'
                )}
              </button>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>For demonstration purposes, use:</p>
              <p>Username: manager</p>
              <p>Password: password</p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-10 text-center text-sm text-gray-200">
        <p>© {new Date().getFullYear()} Bank Access Management System</p>
        <p className="mt-1">Protected by enterprise security</p>
      </div>
    </div>
  );
};

export default LoginPage;