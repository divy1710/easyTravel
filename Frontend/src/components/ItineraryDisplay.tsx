import React from 'react';

interface Place {
  name: string;
  time: string;
  duration: string;
  travelMode: string;
  cost: string;
  description?: string;
}

interface Day {
  day: number;
  date?: string;
  dailyCost: string;
  places: Place[];
}

interface AIItinerary {
  tripSummary: string;
  totalEstimatedCost: string;
  currency?: string;
  currencySymbol?: string;
  country?: string;
  travelTips: string[];
  itinerary: Day[];
  metadata?: {
    landingCity: string;
    tripDays: number;
    month: string;
    budget: string;
    groupType: string;
    interests: string[];
    generatedAt: string;
  };
}

interface ItineraryDisplayProps {
  data: AIItinerary;
  onClose?: () => void;
}

export function ItineraryDisplay({ data, onClose }: ItineraryDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {data.metadata?.landingCity || 'Your Trip'} Itinerary
              {data.country && <span className="text-white/70 text-lg font-normal ml-2">({data.country})</span>}
            </h1>
            <p className="opacity-90">{data.tripSummary}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              &times;
            </button>
          )}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            💰 {data.totalEstimatedCost} {data.currency && <span className="opacity-75">({data.currency})</span>}
          </span>
          {data.metadata && (
            <>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                📅 {data.metadata.tripDays} Days
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                👥 {data.metadata.groupType}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                🌤 {data.metadata.month}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Travel Tips */}
      {data.travelTips && data.travelTips.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Travel Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-yellow-900">
            {data.travelTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Day-wise Itinerary */}
      <div className="space-y-6">
        {data.itinerary.map((day) => (
          <div key={day.day} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
              <h3 className="font-bold text-blue-900">
                Day {day.day} {day.date ? `- ${day.date}` : ''}
              </h3>
              <span className="text-sm text-blue-700 font-medium">{day.dailyCost}</span>
            </div>
            <div className="divide-y">
              {day.places.map((place, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{place.name}</h4>
                    <span className="text-green-600 font-medium">{place.cost}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-2">
                    <span>🕐 {place.time}</span>
                    <span>⏱ {place.duration}</span>
                    <span>🚗 {place.travelMode}</span>
                  </div>
                  {place.description && (
                    <p className="text-sm text-gray-500">{place.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interests Tags */}
      {data.metadata?.interests && (
        <div className="mt-6 flex flex-wrap gap-2">
          {data.metadata.interests.map((interest) => (
            <span
              key={interest}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
