import { motion } from 'framer-motion';
import { MapPin, Cpu, Compass, Plane } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    step: '1',
    title: 'Enter Trip Details',
    description: 'Tell us your destination, dates, budget, and interests',
  },
  {
    icon: Cpu,
    step: '2',
    title: 'AI Plans Your Trip',
    description: 'Our AI generates a personalized day-by-day itinerary',
  },
  {
    icon: Compass,
    step: '3',
    title: 'Customize & Travel',
    description: 'Fine-tune your plan, then hit the road with confidence',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HowItWorks() {
  return (
    <section className="relative py-20 px-4 overflow-hidden" style={{ backgroundColor: '#FDF5F3' }}>
      {/* Decorative elements */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-40">
        <MapPin className="w-12 h-12" style={{ color: '#D97757' }} strokeWidth={1.5} />
      </div>
      <div className="absolute right-8 top-1/4 opacity-40">
        <Plane className="w-16 h-16" style={{ color: '#D97757' }} strokeWidth={1.5} />
      </div>
      
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
            How It Works
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Plan your dream vacation in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative"
            >
              <div className="relative rounded-3xl p-8 hover:shadow-lg transition-all duration-300 text-center h-full" style={{ backgroundColor: '#FDEAE6' }}>
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold text-white px-4 py-1.5 rounded-full shadow-md" style={{ backgroundColor: '#D97757' }}>
                    STEP {step.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 mt-4 rounded-full bg-white flex items-center justify-center" style={{ borderColor: '#F5D5CE', borderWidth: '2px' }}>
                  <step.icon className="w-7 h-7" style={{ color: '#D97757' }} strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
