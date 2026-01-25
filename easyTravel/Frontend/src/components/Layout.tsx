import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Instagram,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

/* Logo */
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

  /* ✅ AUTH PAGE CHECK */
  const isAuthPage =
    location.pathname === '/signup' ||
    location.pathname === '/login';

  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/');
  };

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      {!isAuthPage && (
        <header
          className={`px-2 py-3 transition-all duration-300 ${
            isHomePage
              ? 'absolute top-0 left-0 right-0 z-50 bg-transparent'
              : 'fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-gray-200/50'
          }`}
        >
          <div className="w-full flex items-center justify-between px-4">
            <Logo />

            <nav className="flex items-center gap-8">
              {user ? (
                <>
                  <Link
                    to="/trips"
                    className={`font-semibold text-sm transition-all ${
                      isHomePage
                        ? 'text-white/90 hover:text-white'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    My Trips
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`font-semibold text-sm transition-all ${
                      isHomePage
                        ? 'text-white/90 hover:text-white'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    Dashboard
                  </Link>

                  {/* Profile */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-md ${
                        isHomePage
                          ? 'bg-white/15 text-white'
                          : 'bg-indigo-50 text-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isProfileOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 bg-gray-50 border-b">
                            <p className="font-semibold">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>

                          <div className="py-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </Link>

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-md text-sm bg-white border"
                  style={{ color: '#D97757', borderColor: '#F5D5CE' }}
                >
                  Sign in / Register
                </Link>
              )}
            </nav>
          </div>
        </header>
      )}

      {/* Spacer for fixed header */}
      {!isAuthPage && !isHomePage && <div className="h-16" />}

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 ${
          isHomePage || isAuthPage ? '' : 'container mx-auto p-4'
        }`}
      >
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              <div>
                <h3 className="font-bold text-xl" style={{ color: '#D97757' }}>
                  Travel ✈
                </h3>
                <p className="text-gray-500 text-sm mt-3">
                  Travel helps companies manage payments easily.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="https://www.instagram.com/primetravel04"
                    target="_blank"
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#FDEAE6', color: '#D97757' }}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:primetravel04@gmail.com"
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#FDEAE6', color: '#D97757' }}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {['Company', 'Support'].map((title) => (
                <div key={title}>
                  <h4 className="font-semibold mb-4">{title}</h4>
                  <ul className="space-y-2 text-gray-500 text-sm">
                    <li>About Us</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                  </ul>
                </div>
              ))}

              <div>
                <h4 className="font-semibold mb-4">Newsletter</h4>
                <input
                  placeholder="Your email"
                  className="border px-3 py-2 rounded-md w-full text-sm"
                />
              </div>
            </div>

            <div className="border-t pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} PrimeTravel. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}