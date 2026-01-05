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
      <header className={`px-2 py-2 transition-all duration-300 ${
        isHomePage 
          ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' 
          : 'fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50'
      }`}>
        <div className="w-full flex items-center justify-between px-2">
          <Logo />
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to="/trips" 
                  className={`transition-colors font-medium ${
                    isHomePage 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  My Trips
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors font-medium ${
                    isHomePage 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                      isHomePage
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
                  to="/login" 
                  className={`transition-colors font-medium ${
                    isHomePage 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-5 py-2 rounded-full font-semibold transition-all ${
                    isHomePage
                      ? 'bg-white text-gray-900 hover:shadow-lg hover:shadow-white/25'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                  }`}
                >
                  Get Started
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
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-xl">PrimeTravel</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your AI-powered travel companion for personalized itineraries.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Mail, href: 'mailto:primetravel04@gmail.com' },
                  { icon: Instagram, href: 'https://www.instagram.com/primetravel04?igsh=OWU1eHRubzVsbDRo' },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'How It Works', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} PrimeTravel. All rights reserved.</p>
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
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-80 pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm transition-all"
            required
          />
        </div>
        <motion.button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitted ? (
            <>
              <Heart className="w-5 h-5" />
              Subscribed!
            </>
          ) : (
            <>
              Subscribe
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
      {isSubmitted && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 text-cyan-400 text-sm"
        >
          🎉 Welcome aboard! Check your inbox for travel inspiration.
        </motion.p>
      )}
    </form>
  );
}
