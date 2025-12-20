import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrip } from '../api/trip';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load trip</p>
        <button onClick={() => navigate('/trips')} className="text-blue-600 hover:underline">
          Back to trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/trips')}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
        <div className="flex gap-4 text-sm opacity-90">
          <span>📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          <span>🗓 {trip.days?.length || 0} days</span>
        </div>
      </div>

      {/* Days */}
      {trip.days && trip.days.length > 0 ? (
        <div className="space-y-6">
          {trip.days.map((day: any, dayIdx: number) => (
            <div key={dayIdx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b">
                <h3 className="font-bold text-blue-900">
                  Day {dayIdx + 1} - {new Date(day.date).toLocaleDateString()}
                </h3>
                {day.notes && <p className="text-sm text-blue-700">{day.notes}</p>}
              </div>
              <div className="divide-y">
                {day.places && day.places.length > 0 ? (
                  day.places.map((place: any, placeIdx: number) => (
                    <div key={placeIdx} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{place.name}</h4>
                          {place.type && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{place.type}</span>
                          )}
                        </div>
                        {place.aiRecommendation && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            AI Recommended
                          </span>
                        )}
                      </div>
                      {place.notes && (
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{place.notes}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-500">No places planned for this day</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No itinerary data available</p>
        </div>
      )}
    </div>
  );
}
