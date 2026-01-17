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
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Visualize your entire trip with integrated Mapbox maps. See routes, distances, and nearby attractions.',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Customization',
    description: 'Easily reorder days and activities with intuitive drag-and-drop. Your trip, your way.',
  },
  {
    icon: Wallet,
    title: 'Budget-Aware Planning',
    description: 'Set your budget and get cost estimates for each activity. No surprise expenses.',
  },
  {
    icon: Share2,
    title: 'Export & Share',
    description: 'Download your itinerary or share it with travel companions. Collaborate seamlessly.',
  },
  {
    icon: Clock,
    title: 'Realistic Timelines',
    description: 'AI calculates actual travel times between locations, ensuring your schedule is achievable.',
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
    <section className="relative py-20 px-4" style={{ backgroundColor: '#FDF5F3' }}>
      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Everything you need to plan the perfect trip, all in one place
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white hover:shadow-md transition-all duration-300"
              style={{ border: '1px solid #FEE8E4' }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D97757' }}>
                <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
