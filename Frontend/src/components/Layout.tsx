import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Facebook, Twitter, Instagram, Linkedin, Youtube, Heart, Globe, Shield, Clock, User, LogOut, Settings, ChevronDown, Plane } from 'lucide-react';

// Logo Component
function Logo() {
  return (
    <Link to="/" className="flex items-center group">
      <motion.img
        src="/logo.jpeg"
        alt="PrimeTravel"
        className="h-14 w-14 rounded-full object-cover border-2 border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if we're on the home page for full-width layout
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - absolute on home page, fixed on other pages */}
      <header className={`px-2 py-3 transition-all duration-300 ${
        isHomePage 
          ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' 
          : 'fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-gray-200/50'
      }`}>
        <div className="w-full flex items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-8">
            {user ? (
              <>
                <Link 
                  to="/trips" 
                  className={`transition-all font-semibold text-sm ${
                    isHomePage 
                      ? 'text-white/90 hover:text-white hover:scale-105' 
                      : 'text-gray-700 hover:text-indigo-600 hover:scale-105'
                  }`}
                >
                  My Trips
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`transition-all font-semibold text-sm ${
                    isHomePage 
                      ? 'text-white/90 hover:text-white hover:scale-105' 
                      : 'text-gray-700 hover:text-indigo-600 hover:scale-105'
                  }`}
                >
                  Dashboard
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg ${
                      isHomePage
                        ? 'bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white border border-white/20'
                        : 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-gray-700 border border-indigo-200/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isHomePage
                        ? 'bg-white/20'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                      <User className={`w-4 h-4 ${isHomePage ? 'text-white' : 'text-white'}`} />
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span>Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 rounded-md font-normal text-sm transition-all bg-white shadow-sm hover:bg-gray-50"
                  style={{ color: '#D97757', border: '1px solid #F5D5CE' }}
                >
                  Sign in / Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header - only on non-home pages */}
      {!isHomePage && <div className="h-16" />}

      {/* Main content - full width for home, contained for other pages */}
      <main className={`flex-1 ${isHomePage ? '' : 'container mx-auto p-4'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xl" style={{ color: '#D97757' }}>Travel</span>
                <span className="text-xl" style={{ color: '#D97757' }}>✈</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Travel helps companies manage payments easily.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: 'https://www.instagram.com/primetravel04' },
                  { icon: Mail, href: 'mailto:primetravel04@gmail.com' },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                    style={{ backgroundColor: '#FDEAE6', color: '#D97757' }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'How It Works', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Join Our Newsletter</h4>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PrimeTravel. All rights reserved. Made with <span style={{ color: '#D97757' }}>❤</span> for travelers worldwide 🌍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-4 py-2.5 rounded-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-sm"
          required
        />
        <button
          type="submit"
          className="px-5 py-2.5 text-white font-medium rounded-md text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#D97757' }}
        >
          {isSubmitted ? 'Subscribed!' : 'Subscribe'}
        </button>
      </div>
      {isSubmitted && (
        <p className="mt-2 text-sm" style={{ color: '#D97757' }}>
          🎉 Welcome aboard!
        </p>
      )}
    </form>
  );
}
