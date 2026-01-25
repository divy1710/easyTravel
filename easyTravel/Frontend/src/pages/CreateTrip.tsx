import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createTripWithAI } from '../api/trip';
import { api } from '../api/client';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  MapPin,
  Wallet,
  Users,
  Heart,
  Plane,
  Sun,
  Snowflake,
  Leaf,
  Cloud,
  Loader2
} from 'lucide-react';

interface PlaceSuggestion {
  id: string;
  name: string;
  fullName: string;
  coordinates: [number, number];
  type: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const INTERESTS = [
  { name: 'Beaches', emoji: '🏖️' },
  { name: 'Hills', emoji: '⛰️' },
  { name: 'Culture', emoji: '🏛️' },
  { name: 'Ayurveda', emoji: '🧘' },
  { name: 'Food', emoji: '🍜' },
  { name: 'Adventure', emoji: '🎯' }
];

const getSeasonIcon = (month: string) => {
  const winterMonths = ['December', 'January', 'February'];
  const springMonths = ['March', 'April', 'May'];
  const summerMonths = ['June', 'July', 'August'];
  
  if (winterMonths.includes(month)) return Snowflake;
  if (springMonths.includes(month)) return Leaf;
  if (summerMonths.includes(month)) return Sun;
  return Cloud;
};

export default function CreateTrip() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [tripDays, setTripDays] = useState(3);
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [landingCity, setLandingCity] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [budget, setBudget] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [groupType, setGroupType] = useState<'Solo' | 'Couple' | 'Family'>('Solo');
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search for city suggestions
  useEffect(() => {
    const searchPlaces = async () => {
      if (landingCity.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await api.get('/places/search', {
          params: { q: landingCity, limit: 5 }
        });
        setSuggestions(res.data.suggestions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPlaces, 300);
    return () => clearTimeout(debounceTimer);
  }, [landingCity]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: PlaceSuggestion) => {
    setLandingCity(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const mutation = useMutation({
    mutationFn: createTripWithAI,
    onSuccess: (data) => {
      setGeneratedItinerary(data.aiItinerary);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (tripDays < 1 || tripDays > 30) errs.tripDays = 'Days must be between 1 and 30';
    if (!landingCity.trim()) errs.landingCity = 'Landing city is required';
    if (landingCity.trim().length < 2) errs.landingCity = 'Enter a valid city name';
    if (interests.length === 0) errs.interests = 'Select at least one interest';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      tripDays,
      month,
      landingCity: landingCity.trim(),
      budget,
      groupType,
      interests,
    });
  };

  const SeasonIcon = getSeasonIcon(month);

  // Show generated itinerary if available
  if (generatedItinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/trips')}
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
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />

      {/* Animated orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/trips')}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to My Trips</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white/80 text-xs sm:text-sm font-medium">AI-Powered Planning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 px-4">
              Plan Your <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Dream Trip</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
              Tell us about your perfect adventure, and our AI will craft a personalized itinerary just for you.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 relative overflow-hidden"
          >
            {/* Loading Overlay */}
            {mutation.isPending && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl sm:rounded-3xl">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-500/30 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
                  <Plane className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
                </div>
                <p className="text-lg sm:text-xl font-semibold text-white mb-2 px-4 text-center">Creating your perfect itinerary…</p>
                <p className="text-white/60 text-sm sm:text-base px-4 text-center">Our AI is planning your adventure</p>
              </div>
            )}

            {/* Error Message */}
            {mutation.isError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-sm sm:text-base">
                {(mutation.error as any)?.response?.data?.error || 'Failed to generate itinerary. Please try again.'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
              {/* Trip Duration & Month Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Trip Days */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                    Trip Duration
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={tripDays}
                      onChange={(e) => setTripDays(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="w-14 sm:w-16 text-center bg-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-white font-semibold text-sm sm:text-base">
                      {tripDays} {tripDays === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                  {errors.tripDays && <p className="text-red-400 text-sm mt-2">{errors.tripDays}</p>}
                </div>

                {/* Month */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    <SeasonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                    Travel Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-white text-sm sm:text-base focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m} className="bg-slate-800">{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Landing City */}
              <div className="relative">
                <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  Destination City
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={landingCity}
                    onChange={(e) => setLandingCity(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="e.g., Paris, Tokyo, New York..."
                    className="w-full bg-white/10 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl"
                    >
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-start gap-2 sm:gap-3 hover:bg-white/10 transition-colors text-left"
                        >
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm sm:text-base truncate">{suggestion.name}</p>
                            <p className="text-white/50 text-xs sm:text-sm truncate">{suggestion.fullName}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.landingCity && <p className="text-red-400 text-sm mt-2">{errors.landingCity}</p>}
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {(['Low', 'Medium', 'High'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                        budget === b
                          ? 'bg-indigo-500/30 border-indigo-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-base sm:text-lg mb-0.5 sm:mb-1">
                        {b === 'Low' ? '💰' : b === 'Medium' ? '💰💰' : '💰💰💰'}
                      </div>
                      <span className="font-medium text-sm sm:text-base">{b}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Type */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  Travel Group
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {(['Solo', 'Couple', 'Family'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGroupType(g)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                        groupType === g
                          ? 'bg-indigo-500/30 border-indigo-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-base sm:text-lg mb-0.5 sm:mb-1">
                        {g === 'Solo' ? '🧳' : g === 'Couple' ? '💑' : '👨‍👩‍👧‍👦'}
                      </div>
                      <span className="font-medium text-sm sm:text-base">{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  Your Interests
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {INTERESTS.map(({ name, emoji }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleInterest(name)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all text-sm sm:text-base ${
                        interests.includes(name)
                          ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40 border-indigo-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-2">{emoji}</span>
                      {name}
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="text-red-400 text-sm mt-2">{errors.interests}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                {mutation.isPending ? 'Creating Magic…' : 'Generate My Itinerary'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
