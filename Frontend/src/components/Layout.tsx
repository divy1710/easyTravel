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

      {/* Modern footer */}
      <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl" />
        </div>

        {/* Newsletter CTA Section */}
        <div className="relative border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Let's Turn That Wanderlust Into a{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Boarding Pass
                  </span>
                </motion.h2>
                <p className="text-gray-400 text-lg max-w-xl">
                  Good vibes & great deals, straight to your inbox. Subscribe for exclusive travel tips and offers!
                </p>
              </div>
              <motion.div 
                className="w-full lg:w-auto"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <NewsletterForm />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/25"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Plane className="w-6 h-6 text-white transform rotate-[-30deg]" />
                </motion.div>
                <div className="flex items-baseline">
                  <span className="font-extrabold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Prime</span>
                  <span className="font-extrabold text-2xl bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Travel</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                PrimeTravel is your AI-powered travel companion, crafting personalized itineraries that turn your travel dreams into unforgettable adventures.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <a href="mailto:hello@primetravel.com" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>hello@primetravel.com</span>
                </a>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+1 (234) 567-890</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Travel Destinations */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Destinations
              </h4>
              <ul className="space-y-3">
                {['Europe', 'Asia', 'North America', 'South America', 'Australia', 'Africa', 'Caribbean'].map((dest) => (
                  <li key={dest}>
                    <Link to="/" className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-flex items-center gap-1 group">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', link: '/' },
                  { name: 'How It Works', link: '/' },
                  { name: 'Testimonials', link: '/' },
                  { name: 'Blog', link: '/' },
                  { name: 'Careers', link: '/' },
                  { name: 'Contact Us', link: '/' },
                ].map(({ name, link }) => (
                  <li key={name}>
                    <Link to={link} className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-flex items-center gap-1 group">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', link: '/' },
                  { name: 'Privacy Policy', link: '/' },
                  { name: 'Terms of Service', link: '/' },
                  { name: 'Refund Policy', link: '/' },
                  { name: 'Cookie Policy', link: '/' },
                  { name: 'FAQ', link: '/' },
                ].map(({ name, link }) => (
                  <li key={name}>
                    <Link to={link} className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-flex items-center gap-1 group">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 py-8 border-t border-b border-white/10 mb-8">
            {[
              { icon: Shield, text: 'Secure Payments' },
              { icon: Clock, text: '24/7 Support' },
              { icon: Globe, text: '500+ Destinations' },
              { icon: Heart, text: '100K+ Happy Travelers' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              © {new Date().getFullYear()} PrimeTravel. Made with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 
              for travelers worldwide.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
              <Link to="/" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
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
