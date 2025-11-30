import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// We use simple SVG icons for a clean look without extra dependencies
const IconMenu = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconX = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconChevron = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    nav('/');
  }

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={clsx(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
        isActive(to) 
          ? "bg-blue-50 text-blue-700" 
          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
      )}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Skills<span className="text-blue-600">App</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/browse">Browse Services</NavLink>
            <NavLink to="/tasks">Task Board</NavLink>
            
            {user ? (
              <>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                {/* User Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center gap-2 max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1 pr-3 hover:bg-gray-50 border border-gray-200 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                    <IconChevron />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100"
                      >
                        <div className="py-2 px-2">
                          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Menu
                          </p>
                          <Link to="/dashboard" className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                            Dashboard
                          </Link>
                          <Link to="/inbox" className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                            Inbox
                          </Link>
                          <Link to="/profile" className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                            Profile Settings
                          </Link>
                        </div>
                        
                        {user.role === 'provider' && (
                          <div className="py-2 px-2">
                            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Provider
                            </p>
                            <Link to="/new-service" className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                              Post New Service
                            </Link>
                          </div>
                        )}

                        <div className="py-2 px-2">
                          <button
                            onClick={handleLogout}
                            className="w-full group flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/browse" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Browse</Link>
              <Link to="/tasks" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Tasks</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <div className="mt-4 flex flex-col gap-2 p-2">
                  <Link to="/login" className="w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">Log in</Link>
                  <Link to="/signup" className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}