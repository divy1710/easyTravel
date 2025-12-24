import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrips, deleteTrip } from '../api/trip';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import {
  Plus,
  Plane,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  Sparkles,
  Globe,
  ArrowLeft,
  Search,
  Clock
} from 'lucide-react';

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  days: any[];
  createdAt: string;
}

export default function Trips() {
  const queryClient = useQueryClient();
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: trips, isLoading, error } = useQuery<Trip[]>({ queryKey: ['trips'], queryFn: getTrips });
  const mutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setDeleteConfirm(null);
    }
  });

  const filteredTrips = trips?.filter((trip: Trip) =>
    trip.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDayCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Show generated itinerary if available
  if (generatedItinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setGeneratedItinerary(null)}
            className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Trips
          </motion.button>
          <ItineraryDisplay data={generatedItinerary} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />

      {/* Animated orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">Your Adventures</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  My <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Trips</span>
                </h1>
                <p className="text-white/60 text-lg">
                  {trips?.length || 0} adventures planned and counting
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/trips/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Create AI Trip
                  <Plus className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search trips by city or month..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading your adventures...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-red-400" />
              </div>
              <p className="text-red-400">Failed to load trips. Please try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredTrips?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-12 h-12 text-white/30" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchQuery ? 'No trips found' : 'No adventures yet'}
              </h3>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No trips match "${searchQuery}". Try a different search.`
                  : 'Your journey begins with a single trip. Let our AI plan your perfect adventure!'}
              </p>
              {!searchQuery && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/trips/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Create Your First Trip
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Trips Grid */}
          {!isLoading && !error && filteredTrips && filteredTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredTrips.map((trip: Trip, index: number) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all">
                      {/* Card Header with gradient */}
                      <div className="h-32 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                            <Plane className="w-8 h-8 text-white transform rotate-[-30deg]" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                            {getDayCount(trip.startDate, trip.endDate)} Days
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                          {trip.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4" />
                            {formatDate(trip.startDate)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4" />
                            {trip.days?.length || 0} activities
                          </span>
                        </div>

                        <p className="text-sm text-white/40 mb-4">
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            to={`/trips/${trip._id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Trip
                          </Link>
                          {deleteConfirm === trip._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => mutation.mutate(trip._id)}
                                disabled={mutation.isPending}
                                className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                              >
                                {mutation.isPending ? '...' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(trip._id)}
                              className="p-2.5 bg-white/5 text-white/60 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
