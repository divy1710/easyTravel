import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does PrimeTravel create my personalized trip?",
    answer: "Simply tell us your destination, travel dates, interests, and budget. Our AI analyzes thousands of options and creates a custom itinerary tailored just for you. Whether you're into adventure, culture, relaxation, or food — we craft a trip that matches your unique travel style.",
  },
  {
    question: "What makes PrimeTravel itineraries different from others?",
    answer: "Our itineraries combine AI intelligence with real travel expertise. We don't just list tourist spots — we create logical day-by-day plans with optimal timing, hidden gems, local experiences, and practical tips.",
  },
  {
    question: "Can I modify my itinerary after it's created?",
    answer: "Absolutely! Your itinerary is fully customizable. Add or remove activities, swap destinations, adjust timing — it's your trip, your way.",
  },
  {
    question: "Is PrimeTravel free to use?",
    answer: "Yes! Creating and viewing itineraries is completely free. We offer premium features like offline access, real-time updates, and priority support for our Pro members.",
  },
  {
    question: "How accurate are the cost estimates?",
    answer: "Our AI analyzes real-time data from multiple sources to provide accurate budget estimates. We show costs in the local currency of your destination and break down expenses by category.",
  },
  {
    question: "Can PrimeTravel help with visa and travel requirements?",
    answer: "We provide general guidance on visa requirements, travel advisories, and documentation needed for your destination. However, we always recommend checking with official embassy websites.",
  },
  {
    question: "What if I don't know where to go?",
    answer: "That's the fun part! Tell us what kind of experience you're looking for and our AI will suggest perfect destinations that match your vibe and budget.",
  },
  {
    question: "Does PrimeTravel book flights and hotels?",
    answer: "Currently, we focus on creating the perfect itinerary. We provide recommendations and links to trusted booking platforms for flights, accommodations, and activities.",
  },
  {
    question: "Can I plan group trips with PrimeTravel?",
    answer: "Yes! Whether you're planning a solo adventure, romantic getaway, family vacation, or group trip with friends — our AI considers group dynamics and creates itineraries that work for everyone.",
  },
  {
    question: "How do I get support if something goes wrong?",
    answer: "Our support team is here to help! Reach out via email at hello@primetravel.com or through our in-app chat. We're committed to making your travel planning experience smooth and stress-free.",
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <div 
        className="bg-white rounded-xl overflow-hidden transition-all duration-300"
        style={{ border: '1px solid #F0F0F0' }}
      >
        <button
          onClick={onToggle}
          className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
        >
          <span className="font-medium text-gray-800 text-sm">
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FDEAE6' }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: '#D97757' }} />
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
              <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Everything you need to know about planning your perfect trip with PrimeTravel.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3 mb-16">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* Still have questions banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl px-12 py-16 text-center"
          style={{ backgroundColor: '#D97757' }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Our friendly team is here to help you plan the trip of your dreams
          </p>
          <button className="bg-white px-10 py-4 rounded-full text-base font-medium transition-all hover:bg-gray-100 shadow-lg" style={{ color: '#333' }}>
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}
