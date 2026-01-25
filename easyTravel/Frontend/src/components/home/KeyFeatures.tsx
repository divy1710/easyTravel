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
    description:
      'Smart algorithms create personalized day-by-day plans based on your preferences and travel style.',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description:
      'Visualize your entire trip with integrated Mapbox maps. See routes, distances, and nearby attractions.',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Customization',
    description:
      'Easily reorder days and activities with intuitive drag-and-drop. Your trip, your way.',
  },
  {
    icon: Wallet,
    title: 'Budget-Aware Planning',
    description:
      'Set your budget and get cost estimates for each activity. No surprise expenses.',
  },
  {
    icon: Share2,
    title: 'Export & Share',
    description:
      'Download your itinerary or share it with travel companions. Collaborate seamlessly.',
  },
  {
    icon: Clock,
    title: 'Realistic Timelines',
    description:
      'AI calculates actual travel times between locations, ensuring your schedule is achievable.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function KeyFeatures() {
  return (
    <section className="py-24 bg-[#FFF6F2]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to plan the perfect trip, all in one place
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-6xl mx-auto"
        >

          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="
                bg-[#FFEFE8]
                border border-dashed border-[#F3C6B8]
                rounded-[80px]
                pr-20 py-6 pl-8
                flex items-center gap-6
                max-w-[560px] w-full mx-auto
              "

            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#E07A5F] flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
              </div>


              {/* Text */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[420px]">
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
