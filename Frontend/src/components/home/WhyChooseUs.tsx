import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const benefits = [
  {
    title: 'No Travel Knowledge Required',
    description: 'Just tell us where you want to go — our AI handles the rest.',
  },
  {
    title: 'Realistic Travel Times',
    description: 'We calculate actual distances and commute times between locations.',
  },
  {
    title: 'Budget-Friendly Plans',
    description: 'Get cost estimates and stay within your travel budget.',
  },
  {
    title: 'Saves Hours of Planning',
    description: 'What takes days of research, we do in seconds.',
  },
  {
    title: 'Always Up to Date',
    description: 'Our AI uses current data to suggest the best places.',
  },
  {
    title: 'Fully Customizable',
    description: 'Every itinerary is a starting point — make it yours.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-slate-950">
      {/* Top glow */}
      <motion.div
        aria-hidden
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.22),_transparent_60%)]"
      />

      {/* Bottom glow */}
      <motion.div
        aria-hidden
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(168,85,247,0.18),_transparent_55%)]"
      />

      {/* Noise */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Travelers Love
              <br />
              <span className="text-indigo-400">PrimeTravel</span>
            </h2>

            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              We’ve helped thousands of travelers plan unforgettable trips.
              Here’s why they keep coming back.
            </p>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {benefits.map((benefit) => (
                <motion.li
                  key={benefit.title}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {benefit.title}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10K+', label: 'Trips Planned', from: 'indigo', to: 'purple' },
                { value: '4.9', label: 'User Rating', from: 'cyan', to: 'blue', mt: true },
                { value: '30s', label: 'Avg. Plan Time', from: 'orange', to: 'red' },
                { value: '50+', label: 'Countries', from: 'green', to: 'emerald', mt: true },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br from-${stat.from}-500 to-${stat.to}-600 ${
                    stat.mt ? 'mt-6' : ''
                  }`}
                >
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Glow */}
            <div className="absolute -z-10 inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
