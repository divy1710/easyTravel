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
    answer:
      "Simply tell us your destination, travel dates, interests, and budget. Our AI analyzes thousands of options and creates a custom itinerary tailored just for you.",
  },
  {
    question: "What makes PrimeTravel itineraries different from others?",
    answer:
      "Our itineraries combine AI intelligence with real travel expertise, creating logical day-by-day plans with optimal timing and local experiences.",
  },
  {
    question: "Can I modify my itinerary after it's created?",
    answer:
      "Absolutely! Your itinerary is fully customizable. Add or remove activities, swap destinations, or adjust timing anytime.",
  },
  {
    question: "Is PrimeTravel free to use?",
    answer:
      "Yes! Creating and viewing itineraries is free. We also offer premium features for advanced planning.",
  },
  {
    question: "How accurate are the cost estimates?",
    answer:
      "Our AI uses real-time data from multiple sources to provide accurate and transparent cost estimates.",
  },
  {
    question: "Can PrimeTravel help with visa and travel requirements?",
    answer:
      "We provide general guidance on visa requirements and travel advisories for your destination.",
  },
  {
    question: "What if I don't know where to go?",
    answer:
      "Tell us your preferences and our AI will suggest destinations perfectly suited to your travel style.",
  },
  {
    question: "Does PrimeTravel book flights and hotels?",
    answer:
      "Currently, we provide recommendations and trusted booking links instead of direct booking.",
  },
  {
    question: "Can I plan group trips with PrimeTravel?",
    answer:
      "Yes! Our AI creates itineraries suitable for solo, family, and group travel.",
  },
  {
    question: "How do I get support if something goes wrong?",
    answer:
      "Contact us via email or in-app chat. Our support team is always happy to help.",
  },
];

function FAQAccordion({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-8 py-4 flex items-center justify-between gap-4"
      >
        {/* Question */}
        <span className="font-medium text-gray-900 text-sm md:text-base">
          {item.question}
        </span>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#FDEAE6]"
        >
          <ChevronDown className="w-4 h-4 text-[#D97757]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
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
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl px-10 py-14 text-center"
          style={{ backgroundColor: '#D97757' }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-white/90 text-base mb-6 max-w-lg mx-auto">
            Our friendly team is here to help you plan the trip of your dreams
          </p>
          <button className="bg-white px-8 py-3 rounded-full text-sm font-medium shadow-lg hover:bg-gray-100">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}
