import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X, ChevronDown, Users, Upload, BarChart2 } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={20} /> },
    { name: 'Upload Access Data', path: '/upload', icon: <Upload size={20} /> },
    { name: 'Review Access', path: '/review', icon: <Users size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0A2463] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and desktop navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Users className="h-8 w-8 text-[#E6AF2E]" />
                <span className="ml-2 text-xl font-bold">Access Manager</span>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === link.path
                        ? 'border-[#E6AF2E] text-white'
                        : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                    } transition-colors duration-200`}
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-[#0F307E] focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* User menu (desktop) */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0F307E] hover:bg-[#143594] focus:outline-none transition-colors duration-200"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="mr-2">{user?.name}</span>
                    <span className="text-xs bg-[#E6AF2E] text-[#0A2463] px-2 py-0.5 rounded-full">
                      {user?.branchName}
                    </span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                </div>
                
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-[#0F307E] border-[#E6AF2E] text-white'
                      : 'border-transparent text-gray-300 hover:bg-[#0F307E] hover:border-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-[#0F307E] hover:border-gray-300 hover:text-white"
              >
                <LogOut size={20} className="mr-2" />
                Sign out
              </button>
              <div className="px-4 py-3 bg-[#0F307E] text-white text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="mt-1">
                  <span className="bg-[#E6AF2E] text-[#0A2463] px-2 py-0.5 rounded-full">
                    {user?.branchName}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Bank Branch Access Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;