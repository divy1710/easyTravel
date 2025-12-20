import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Compass, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Cool teal/blue overlay to complement the golden road */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-slate-900/50 to-indigo-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 rounded-full px-5 py-2.5 mb-8"
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium tracking-wide">AI-Powered Travel Planning</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            <span className="text-white drop-shadow-2xl">Explore The</span>
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Open Road
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Your perfect adventure is just a click away. AI-crafted itineraries, 
            breathtaking destinations, and memories that last forever.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={isLoggedIn ? '/trips/new' : '/signup'}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-900 font-bold px-10 py-5 rounded-full shadow-2xl shadow-teal-500/30 hover:shadow-teal-400/50 transition-all duration-300 text-lg"
              >
                <Plane className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                Plan Your Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 flex flex-wrap justify-center gap-8 text-white/70 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              100K+ Travelers
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              4.9★ Rating
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              500+ Destinations
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
