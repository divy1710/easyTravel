import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getTrips } from '../api/trip';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Plane,
  Clock,
  Sparkles,
  ChevronRight,
  Globe,
  Sun,
  CloudSun,
  ArrowRight
} from 'lucide-react';

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  days: any[];
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const recentTrips = trips.slice(0, 4);
  const totalTrips = trips.length;
  
  // Extract unique cities from trip titles (format: "City - X Day Trip")
  const citiesExplored = new Set(trips.map(t => t.title.split(' - ')[0])).size;
  
  // Calculate total days from start/end dates
  const totalDays = trips.reduce((acc, t) => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return acc + days;
  }, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 18) return { text: 'Good Afternoon', icon: CloudSun };
    return { text: 'Good Evening', icon: CloudSun };
  };

  const greeting = getGreeting();
  const userName = user?.email ? user.email.split('@')[0] : 'Traveler';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 mb-2">
                  <greeting.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{greeting.text}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Welcome, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
                </h1>
                <p className="text-white/60 text-lg">
                  Your travel command center. Plan, explore, and discover.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/trips/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Plan New Adventure
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{totalTrips}</span>
              </div>
              <p className="text-white/60 font-medium">Total Trips</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{citiesExplored}</span>
              </div>
              <p className="text-white/60 font-medium">Cities Explored</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{totalDays}</span>
              </div>
              <p className="text-white/60 font-medium">Days Planned</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Recent Trips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Recent Adventures
                </h2>
                <Link to="/trips" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/50">Loading your trips...</p>
                </div>
              ) : recentTrips.length > 0 ? (
                <div className="p-4 grid grid-cols-2 gap-4">
                  {recentTrips.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        to={`/trips/${trip._id}`}
                        className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Plane className="w-5 h-5 text-white transform rotate-[-30deg]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                              {trip.title}
                            </h3>
                            <p className="text-sm text-white/40">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full">
                            <Calendar className="w-3 h-3" />
                            {trip.days?.length || 0} days
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {trip.days?.reduce((acc: number, day: any) => acc + (day.places?.length || 0), 0) || 0} places
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">No trips yet</h3>
                  <p className="text-white/50 mb-6">Start planning your first adventure!</p>
                  <Link
                    to="/trips/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Trip
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/trips/new"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white hover:from-indigo-500/30 hover:to-purple-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-medium block">Create New Trip</span>
                      <span className="text-xs text-white/50">AI-powered planning</span>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-white/30 group-hover:text-white/60 transition-colors" />
                  </Link>
                  <Link
                    to="/trips"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <span className="font-medium block">View All Trips</span>
                      <span className="text-xs text-white/50">Manage your adventures</span>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-white/30 group-hover:text-white/60 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Travel Inspiration */}
              <div className="relative overflow-hidden rounded-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                <div className="relative p-5">
                  <div className="pt-16">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Featured Destination</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">Explore Switzerland</h3>
                    <p className="text-white/60 text-sm mb-4">Discover breathtaking Alps, pristine lakes, and charming villages.</p>
                    <Link
                      to="/trips/new"
                      className="inline-flex items-center gap-2 text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                    >
                      Plan this trip
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Pro Tip</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Add multiple interests when creating a trip to get more personalized recommendations from our AI.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
