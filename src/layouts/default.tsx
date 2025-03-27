import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { userData, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 text-gray-900 font-semibold">
                MGMT
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/meetings" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Meetings
                </Link>
                <Link to="/todos" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Todos
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              ) : userData ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{userData.email}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {userData.email.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default DefaultLayout;
