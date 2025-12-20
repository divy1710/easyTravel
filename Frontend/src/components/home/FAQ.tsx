import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircleQuestion } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does EasyTravel create my personalized trip?",
    answer: "Simply tell us your destination, travel dates, interests, and budget. Our AI analyzes thousands of options and creates a custom itinerary tailored just for you. Whether you're into adventure, culture, relaxation, or food — we craft a trip that matches your unique travel style."
  },
  {
    question: "What makes EasyTravel itineraries different from others?",
    answer: "Our itineraries combine AI intelligence with real travel expertise. We don't just list tourist spots — we create logical day-by-day plans with optimal timing, hidden gems, local experiences, and practical tips. Each itinerary considers travel time, opening hours, and your energy levels throughout the day."
  },
  {
    question: "Can I modify my itinerary after it's created?",
    answer: "Absolutely! Your itinerary is fully customizable. Add or remove activities, swap destinations, adjust timing — it's your trip, your way. You can also regenerate specific days or ask our AI to suggest alternatives based on weather, mood, or new interests."
  },
  {
    question: "Is EasyTravel free to use?",
    answer: "Yes! Creating and viewing itineraries is completely free. We offer premium features like offline access, real-time updates, and priority support for our Pro members. But you can plan amazing trips without spending a dime."
  },
  {
    question: "How accurate are the cost estimates?",
    answer: "Our AI analyzes real-time data from multiple sources to provide accurate budget estimates. We show costs in the local currency of your destination and break down expenses by category — accommodation, activities, food, and transport. Actual costs may vary slightly based on season and availability."
  },
  {
    question: "Can EasyTravel help with visa and travel requirements?",
    answer: "We provide general guidance on visa requirements, travel advisories, and documentation needed for your destination. However, we always recommend checking with official embassy websites for the most up-to-date requirements specific to your nationality."
  },
  {
    question: "What if I don't know where to go?",
    answer: "That's the fun part! Tell us what kind of experience you're looking for — beach relaxation, mountain adventures, cultural immersion, or culinary exploration — and our AI will suggest perfect destinations that match your vibe and budget."
  },
  {
    question: "Does EasyTravel book flights and hotels?",
    answer: "Currently, we focus on creating the perfect itinerary. We provide recommendations and links to trusted booking platforms for flights, accommodations, and activities. Full booking integration is coming soon!"
  },
  {
    question: "Can I plan group trips with EasyTravel?",
    answer: "Yes! Whether you're planning a solo adventure, romantic getaway, family vacation, or group trip with friends — our AI considers group dynamics and creates itineraries that work for everyone. You can share your itinerary with travel companions for easy coordination."
  },
  {
    question: "How do I get support if something goes wrong?",
    answer: "Our support team is here to help! Reach out via email at hello@easytravel.com or through our in-app chat. Pro members get priority 24/7 support. We're committed to making your travel planning experience smooth and stress-free."
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
      transition={{ delay: index * 0.03 }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
        }`}>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
              isOpen 
                ? 'bg-white text-indigo-600' 
                : 'bg-white/10 text-cyan-400'
            }`}
          >
            <Plus className="w-4 h-4" />
          </motion.div>
          <span className={`font-medium text-lg leading-snug ${
            isOpen ? 'text-white' : 'text-gray-100'
          }`}>
            {item.question}
          </span>
        </div>
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
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-5 pb-5 pt-0 rounded-b-xl -mt-2">
              <div className="pl-10">
                <p className="text-white/80 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split FAQs into two columns
  const leftColumnFaqs = faqs.filter((_, i) => i % 2 === 0);
  const rightColumnFaqs = faqs.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-xl shadow-indigo-500/25"
          >
            <MessageCircleQuestion className="w-8 h-8" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Planning made simple with answers to your most common questions.
          </p>
        </motion.div>

        {/* Two Column FAQ Layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumnFaqs.map((faq, idx) => {
              const originalIndex = idx * 2;
              return (
                <FAQAccordion
                  key={originalIndex}
                  item={faq}
                  index={originalIndex}
                  isOpen={openIndex === originalIndex}
                  onToggle={() => handleToggle(originalIndex)}
                />
              );
            })}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {rightColumnFaqs.map((faq, idx) => {
              const originalIndex = idx * 2 + 1;
              return (
                <FAQAccordion
                  key={originalIndex}
                  item={faq}
                  index={originalIndex}
                  isOpen={openIndex === originalIndex}
                  onToggle={() => handleToggle(originalIndex)}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80">
            <img 
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2000&q=80" 
              alt="Travel destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p className="text-white/80 text-lg mb-2">Still have questions?</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                We're here to help you plan your dream trip
              </h3>
              <motion.a
                href="mailto:hello@easytravel.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-500/25 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
