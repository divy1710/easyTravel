import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Wallet,
  Coffee,
  Camera,
  Utensils,
  ArrowRight,
} from 'lucide-react';

/* -------------------- SAMPLE DATA -------------------- */
const sampleDays = [
  {
    day: 1,
    title: 'Arrival & Old Town',
    places: [
      { time: '10:00 AM', name: 'Arrive at Airport', icon: MapPin, cost: null, duration: '1h' },
      { time: '12:00 PM', name: 'Lunch at Local Bistro', icon: Utensils, cost: '$25', duration: '1.5h' },
      { time: '02:30 PM', name: 'Explore Old Town Square', icon: Camera, cost: 'Free', duration: '2h' },
      { time: '05:00 PM', name: 'Coffee at Historic Café', icon: Coffee, cost: '$8', duration: '1h' },
    ],
  },
  {
    day: 2,
    title: 'Museums & Culture',
    places: [
      { time: '09:00 AM', name: 'National Art Museum', icon: Camera, cost: '$15', duration: '3h' },
      { time: '01:00 PM', name: 'Riverside Lunch', icon: Utensils, cost: '$30', duration: '1h' },
      { time: '03:00 PM', name: 'Walking Tour - City Center', icon: MapPin, cost: '$20', duration: '2.5h' },
    ],
  },
];

/* -------------------- COMPONENT -------------------- */
export default function SampleItinerary() {
  return (
    <section
      id="sample-trip"
      className="relative py-24 px-4 overflow-hidden bg-slate-950"
    >
      {/* Top glow */}
      <motion.div
        aria-hidden
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.25),_transparent_60%)]"
      />

      {/* Bottom glow */}
      <motion.div
        aria-hidden
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(168,85,247,0.2),_transparent_55%)]"
      />

      {/* Noise texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-3">
            Live Preview
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See What You’ll Get
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A sample 2-day itinerary for Prague — generated in seconds
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/20 border border-white/10 overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Prague Adventure</h3>
                <p className="text-white/80 text-sm">
                  3 days • 2 travelers • $500 budget
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                AI Generated
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="p-6 space-y-10">
            {sampleDays.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: dayIndex * 0.1 }}
              >
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-10 h-10 bg-indigo-500/20 text-indigo-400 font-bold rounded-full text-sm">
                    D{day.day}
                  </span>
                  <h4 className="font-semibold text-white">{day.title}</h4>
                </div>

                {/* Timeline */}
                <div className="ml-5 border-l-2 border-dashed border-white/10 pl-6 space-y-4">
                  {day.places.map((place, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 6 }}
                      className="group relative flex items-start gap-4 p-4 bg-slate-800/60 rounded-xl hover:bg-indigo-500/10 transition-colors"
                    >
                      {/* Dot */}
                      <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-2 border-indigo-400 rounded-full" />

                      {/* Icon */}
                      <div className="w-10 h-10 bg-slate-900 rounded-lg shadow flex items-center justify-center flex-shrink-0">
                        <place.icon className="w-5 h-5 text-indigo-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h5 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                          {place.name}
                        </h5>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {place.time}
                          </span>
                          {place.cost && (
                            <span className="flex items-center gap-1">
                              <Wallet className="w-4 h-4" />
                              {place.cost}
                            </span>
                          )}
                          <span className="opacity-40">•</span>
                          <span>{place.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-slate-900/60 border-t border-white/10">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition group"
            >
              View Full Trip Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
