import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Timer, 
  Car, 
  Bus, 
  Footprints, 
  Bike,
  Train,
  Plane,
  Wallet,
  Calendar,
  Users,
  Sun,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe,
  Heart,
  Navigation,
  DollarSign
} from 'lucide-react';

interface Place {
  name: string;
  time: string;
  duration: string;
  travelMode: string;
  cost: string;
  description?: string;
}

interface Day {
  day: number;
  date?: string;
  dailyCost: string;
  places: Place[];
}

interface AIItinerary {
  tripSummary: string;
  totalEstimatedCost: string;
  currency?: string;
  currencySymbol?: string;
  country?: string;
  travelTips: string[];
  itinerary: Day[];
  metadata?: {
    landingCity: string;
    tripDays: number;
    month: string;
    budget: string;
    groupType: string;
    interests: string[];
    generatedAt: string;
  };
}

interface ItineraryDisplayProps {
  data: AIItinerary;
  onClose?: () => void;
}

const getTravelIcon = (mode: string) => {
  const modeLC = mode.toLowerCase();
  if (modeLC.includes('walk') || modeLC.includes('foot')) return Footprints;
  if (modeLC.includes('bus') || modeLC.includes('public')) return Bus;
  if (modeLC.includes('train') || modeLC.includes('metro') || modeLC.includes('subway')) return Train;
  if (modeLC.includes('bike') || modeLC.includes('cycle')) return Bike;
  if (modeLC.includes('flight') || modeLC.includes('plane')) return Plane;
  return Car;
};

export function ItineraryDisplay({ data, onClose }: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>(data.itinerary.map(d => d.day));
  const [showTips, setShowTips] = useState(true);

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="relative p-8 md:p-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white/90 text-sm font-medium">AI Generated</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {data.metadata?.landingCity || 'Your Trip'}
                {data.country && (
                  <span className="text-white/70 text-2xl font-normal ml-3">{data.country}</span>
                )}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                {data.tripSummary}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide">Total Cost</p>
                  <p className="text-white font-bold text-lg">{data.totalEstimatedCost}</p>
                </div>
              </div>
            </div>
            
            {data.metadata && (
              <>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wide">Duration</p>
                      <p className="text-white font-bold text-lg">{data.metadata.tripDays} Days</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-400/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wide">Group</p>
                      <p className="text-white font-bold text-lg">{data.metadata.groupType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-400/20 rounded-xl flex items-center justify-center">
                      <Sun className="w-5 h-5 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wide">Month</p>
                      <p className="text-white font-bold text-lg">{data.metadata.month}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Travel Tips */}
      {data.travelTips && data.travelTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between hover:from-amber-500/15 hover:to-orange-500/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Travel Tips</h3>
                <p className="text-white/50 text-sm">{data.travelTips.length} tips to make your trip better</p>
              </div>
            </div>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-amber-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-400" />
            )}
          </button>
          
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {data.travelTips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Day-wise Itinerary */}
      <div className="space-y-4">
        {data.itinerary.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + dayIndex * 0.05 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Day Header */}
            <button
              onClick={() => toggleDay(day.day)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{day.day}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white text-lg">
                    Day {day.day}
                    {day.date && <span className="text-white/50 font-normal ml-2">• {day.date}</span>}
                  </h3>
                  <p className="text-white/50 text-sm">{day.places.length} activities planned</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white/50 text-xs uppercase tracking-wide">Daily Budget</p>
                  <p className="text-green-400 font-semibold">{day.dailyCost}</p>
                </div>
                {expandedDays.includes(day.day) ? (
                  <ChevronUp className="w-5 h-5 text-white/50" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/50" />
                )}
              </div>
            </button>

            {/* Day Content */}
            <AnimatePresence>
              {expandedDays.includes(day.day) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                      
                      {/* Places */}
                      <div className="space-y-4">
                        {day.places.map((place, idx) => {
                          const TravelIcon = getTravelIcon(place.travelMode);
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="relative pl-14"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute left-3 top-4 w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-4 border-slate-900" />
                              
                              {/* Place Card */}
                              <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <MapPin className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                        {place.name}
                                      </h4>
                                      {place.description && (
                                        <p className="text-white/50 text-sm mt-1 leading-relaxed">
                                          {place.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="bg-green-400/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                    {place.cost}
                                  </span>
                                </div>
                                
                                {/* Place Meta */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="text-white/70 text-sm">{place.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <Timer className="w-4 h-4 text-purple-400" />
                                    <span className="text-white/70 text-sm">{place.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <TravelIcon className="w-4 h-4 text-cyan-400" />
                                    <span className="text-white/70 text-sm">{place.travelMode}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Interests Tags */}
      {data.metadata?.interests && data.metadata.interests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-white">Trip Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.metadata.interests.map((interest) => (
              <span
                key={interest}
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
