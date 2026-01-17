import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface FinalCTAProps {
  isLoggedIn: boolean;
}

export default function FinalCTA({ isLoggedIn }: FinalCTAProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/playyourdreamtrip.png')`
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2.5 mb-8"
          >
            <span className="w-2 h-2 bg-white rounded-full" />
            <span className="text-white text-sm font-medium">Ready to Start Your Journey?</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Plan Your Dream Trip In Seconds,
            <br />
            Not Hours
          </h2>

          {/* Subtext */}
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of travelers who've discovered the smarter way to plan. 
            Your next adventure is just one click away
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={isLoggedIn ? '/trips/new' : '/signup'}
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#D97757' }}
            >
              <Plane className="w-5 h-5" />
              Create Your Trip Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
