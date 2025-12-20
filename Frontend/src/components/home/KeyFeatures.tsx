import { motion } from 'framer-motion';
import {
  Sparkles,
  Map,
  GripVertical,
  Wallet,
  Share2,
  Clock,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Generated Itineraries',
    description: 'Smart algorithms create personalized day-by-day plans based on your preferences and travel style.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Visualize your entire trip with integrated Mapbox maps. See routes, distances, and nearby attractions.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Customization',
    description: 'Easily reorder days and activities with intuitive drag-and-drop. Your trip, your way.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Wallet,
    title: 'Budget-Aware Planning',
    description: 'Set your budget and get cost estimates for each activity. No surprise expenses.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Share2,
    title: 'Export & Share',
    description: 'Download your itinerary or share it with travel companions. Collaborate seamlessly.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Clock,
    title: 'Realistic Timelines',
    description: 'AI calculates actual travel times between locations, ensuring your schedule is achievable.',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function KeyFeatures() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Premium background with mesh gradient effect */}
      <div className="absolute inset-0 bg-slate-950" />
      
      {/* Animated mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)',
            animation: 'float1 15s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)',
            animation: 'float2 18s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)',
            animation: 'float3 20s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.05); }
          66% { transform: translate(60px, -20px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-3">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to plan the perfect trip, all in one place
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05] transition-all duration-500"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
              
              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
