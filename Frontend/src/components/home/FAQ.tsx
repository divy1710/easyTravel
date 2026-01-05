import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does PrimeTravel create my personalized trip?",
    answer: "Simply tell us your destination, travel dates, interests, and budget. Our AI analyzes thousands of options and creates a custom itinerary tailored just for you. Whether you're into adventure, culture, relaxation, or food — we craft a trip that matches your unique travel style.",
    category: "Getting Started"
  },
  {
    question: "What makes PrimeTravel itineraries different from others?",
    answer: "Our itineraries combine AI intelligence with real travel expertise. We don't just list tourist spots — we create logical day-by-day plans with optimal timing, hidden gems, local experiences, and practical tips. Each itinerary considers travel time, opening hours, and your energy levels throughout the day.",
    category: "Features"
  },
  {
    question: "Can I modify my itinerary after it's created?",
    answer: "Absolutely! Your itinerary is fully customizable. Add or remove activities, swap destinations, adjust timing — it's your trip, your way. You can also regenerate specific days or ask our AI to suggest alternatives based on weather, mood, or new interests.",
    category: "Features"
  },
  {
    question: "Is PrimeTravel free to use?",
    answer: "Yes! Creating and viewing itineraries is completely free. We offer premium features like offline access, real-time updates, and priority support for our Pro members. But you can plan amazing trips without spending a dime.",
    category: "Pricing"
  },
  {
    question: "How accurate are the cost estimates?",
    answer: "Our AI analyzes real-time data from multiple sources to provide accurate budget estimates. We show costs in the local currency of your destination and break down expenses by category — accommodation, activities, food, and transport. Actual costs may vary slightly based on season and availability.",
    category: "Planning"
  },
  {
    question: "Can PrimeTravel help with visa and travel requirements?",
    answer: "We provide general guidance on visa requirements, travel advisories, and documentation needed for your destination. However, we always recommend checking with official embassy websites for the most up-to-date requirements specific to your nationality.",
    category: "Planning"
  },
  {
    question: "What if I don't know where to go?",
    answer: "That's the fun part! Tell us what kind of experience you're looking for — beach relaxation, mountain adventures, cultural immersion, or culinary exploration — and our AI will suggest perfect destinations that match your vibe and budget.",
    category: "Getting Started"
  },
  {
    question: "Does PrimeTravel book flights and hotels?",
    answer: "Currently, we focus on creating the perfect itinerary. We provide recommendations and links to trusted booking platforms for flights, accommodations, and activities. Full booking integration is coming soon!",
    category: "Features"
  },
  {
    question: "Can I plan group trips with PrimeTravel?",
    answer: "Yes! Whether you're planning a solo adventure, romantic getaway, family vacation, or group trip with friends — our AI considers group dynamics and creates itineraries that work for everyone. You can share your itinerary with travel companions for easy coordination.",
    category: "Features"
  },
  {
    question: "How do I get support if something goes wrong?",
    answer: "Our support team is here to help! Reach out via email at hello@primetravel.com or through our in-app chat. Pro members get priority 24/7 support. We're committed to making your travel planning experience smooth and stress-free.",
    category: "Support"
  }
];

function FAQAccordion({ item, isOpen, onToggle, index }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen 
          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/50' 
          : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/10'
      }`}>
        <button
          onClick={onToggle}
          className="w-full text-left p-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4 flex-1">
            {item.category && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 transition-colors ${
                isOpen 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                {item.category}
              </span>
            )}
            <span className={`font-semibold text-lg leading-snug transition-colors ${
              isOpen ? 'text-white' : 'text-gray-100'
            }`}>
              {item.question}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOpen 
                ? 'bg-white text-indigo-600' 
                : 'bg-white/10 text-indigo-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-200'
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0">
                <div className="pl-0 border-l-4 border-white/30 pl-4 bg-white/10 backdrop-blur-sm py-4 rounded-r-lg">
                  <p className="text-white/90 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 overflow-hidden">
      {/* Dark theme background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-300 font-medium text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Got Questions?{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about planning your perfect trip with PrimeTravel.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Our friendly team is here to help you plan the trip of your dreams
            </p>
            
            <motion.a
              href="mailto:hello@primetravel.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-50 transition-all shadow-xl shadow-black/10"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
