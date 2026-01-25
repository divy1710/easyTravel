import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero.jpg')`
        }}
      >
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
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
            className="
              inline-flex items-center gap-2
              bg-white/20 backdrop-blur-md
              border border-white/30
              rounded-full
              px-5 py-2
              mb-4
              shadow-sm
            "
          >
            <Sparkles className="w-4 h-4 text-white/90" />
            <span className="text-white/90 text-sm font-medium">
              AI-Powered Travel Planning
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight text-center text-white drop-shadow-lg">
            <span className="block whitespace-nowrap">
              No matter where you’re going to,
            </span>
            <span className="block">
              we’ll take you there
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto mb-6 leading-relaxed drop-shadow-md">
            Your perfect adventure is just a click away. AI-crafted itineraries, 
            breathtaking destinations, and memories that last forever
          </p>

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={isLoggedIn ? '/trips/new' : '/signup'}
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#D97757' }}
            >
              <Plane className="w-5 h-5" />
              Plan Your Trip
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
