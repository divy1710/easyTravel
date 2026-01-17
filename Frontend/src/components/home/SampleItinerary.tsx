import { motion } from 'framer-motion';
import { Sparkles, MapPin, Utensils, Camera, Coffee } from 'lucide-react';

/* -------------------- SAMPLE DATA -------------------- */
const sampleDays = [
  {
    day: 1,
    title: 'Arrival & Old Town',
    places: [
      { time: '10:00 AM', cost: null, duration: '1h', name: 'Arrive at Airport', icon: MapPin },
      { time: '12:00 PM', cost: '$25', duration: '1.5h', name: 'Lunch at Local Bistro', icon: Utensils },
      { time: '02:30 PM', cost: 'Free', duration: '2h', name: 'Explore Old Town Square', icon: Camera },
      { time: '05:00 PM', cost: '$8', duration: '1h', name: 'Coffee at Historic Café', icon: Coffee },
    ],
  },
  {
    day: 2,
    title: 'Museums & Culture',
    places: [
      { time: '09:00 AM', cost: '$15', duration: '3h', name: 'National Art Museum', icon: Camera },
      { time: '01:00 PM', cost: '$30', duration: '1h', name: 'Riverside Lunch', icon: Utensils },
      { time: '03:00 PM', cost: '$20', duration: '2.5h', name: 'Walking Tour - City Center', icon: MapPin },
    ],
  },
];

/* -------------------- COMPONENT -------------------- */
export default function SampleItinerary() {
  return (
    <section
      id="sample-trip"
      className="relative py-20 px-4"
      style={{ backgroundColor: '#FDF5F3' }}
    >
      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            See What You'll Get
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            A sample 2-day itinerary for Prague — generated in seconds
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ border: '1px solid #F5D5CE' }}
        >
          {/* Card Header */}
          <div className="px-8 py-5 text-white" style={{ backgroundColor: '#D97757' }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold">Prague Adventure</h3>
                <p className="text-white/90 text-sm mt-0.5">
                  3 days • 2 travelers • $500 budget
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#E8907A' }}>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  AI Generated
                </div>
                <button className="bg-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" style={{ color: '#D97757' }}>
                  View Full Trip Details
                </button>
              </div>
            </div>
          </div>

          {/* Days - Two Column Layout */}
          <div className="p-8 grid md:grid-cols-2 gap-12">
            {sampleDays.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: dayIndex * 0.1 }}
              >
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span 
                    className="flex items-center justify-center w-10 h-10 font-semibold rounded-full text-sm border-2"
                    style={{ borderColor: '#FDEAE6', color: '#D97757', backgroundColor: 'white' }}
                  >
                    D{day.day}
                  </span>
                  <h4 className="text-xl font-semibold text-gray-900">{day.title}</h4>
                </div>

                {/* Timeline with dotted line */}
                <div className="relative">
                  {/* Places */}
                  <div className="space-y-4">
                    {day.places.map((place, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4"
                      >
                        {/* Timeline dot with connecting line */}
                        <div className="relative flex-shrink-0 flex flex-col items-center">
                          {/* Dot */}
                          <div 
                            className="w-3 h-3 rounded-full border-2 bg-white z-10"
                            style={{ borderColor: '#D97757' }}
                          />
                          {/* Vertical line to next item */}
                          {index < day.places.length - 1 && (
                            <div 
                              className="w-px flex-1 min-h-[40px]"
                              style={{ 
                                backgroundImage: 'repeating-linear-gradient(to bottom, #D9D9D9 0px, #D9D9D9 3px, transparent 3px, transparent 6px)',
                              }}
                            />
                          )}
                        </div>

                        {/* Activity Card */}
                        <div 
                          className="flex-1 flex items-center gap-4 px-4 py-3 rounded-xl bg-white"
                          style={{ border: '1px solid #F0F0F0' }}
                        >
                          {/* Icon */}
                          <div 
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#FDEAE6' }}
                          >
                            <place.icon className="w-5 h-5" style={{ color: '#D97757' }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900">
                              {place.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                              {place.time}
                              {place.cost && <span className="ml-2">{place.cost}</span>}
                              <span className="mx-1">•</span>
                              {place.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
