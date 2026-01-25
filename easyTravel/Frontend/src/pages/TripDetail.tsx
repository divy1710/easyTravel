import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrip, addPlace, removePlace, togglePlaceCompletion, modifyTripWithAI } from '../api/trip';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import { ArrowLeft } from 'lucide-react';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModifying, setIsModifying] = useState(false);

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id!),
    enabled: !!id,
  });

  const addPlaceMutation = useMutation({
    mutationFn: ({ dayIndex, placeData }: { dayIndex: number; placeData: any }) =>
      addPlace(id!, dayIndex, placeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
  });

  const removePlaceMutation = useMutation({
    mutationFn: ({ dayIndex, placeIndex }: { dayIndex: number; placeIndex: number }) =>
      removePlace(id!, dayIndex, placeIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
  });

  const togglePlaceMutation = useMutation({
    mutationFn: ({ dayIndex, placeIndex }: { dayIndex: number; placeIndex: number }) =>
      togglePlaceCompletion(id!, dayIndex, placeIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
  });

  const modifyTripMutation = useMutation({
    mutationFn: (prompt: string) => modifyTripWithAI(id!, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      setIsModifying(false);
    },
    onError: (error: any) => {
      console.error('AI modification failed:', error);
      alert('Failed to modify trip. Please try again.');
      setIsModifying(false);
    },
  });

  const handlePlaceAdd = (dayIndex: number, placeData: any) => {
    addPlaceMutation.mutate({ dayIndex, placeData });
  };

  const handlePlaceRemove = (dayIndex: number, placeIndex: number) => {
    removePlaceMutation.mutate({ dayIndex, placeIndex });
  };

  const handlePlaceToggle = (dayIndex: number, placeIndex: number) => {
    togglePlaceMutation.mutate({ dayIndex, placeIndex });
  };

  const handleAIModify = (prompt: string) => {
    setIsModifying(true);
    modifyTripMutation.mutate(prompt);
  };

  if (isLoading || isModifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/70">{isModifying ? 'AI is modifying your itinerary...' : 'Loading trip details...'}</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-lg">Failed to load trip</p>
          <button
            onClick={() => navigate('/trips')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            Back to trips
          </button>
        </div>
      </div>
    );
  }

  // Transform trip data to match AIItinerary interface
  const itineraryData = {
    tripSummary: trip.title || 'Your Trip Itinerary',
    totalEstimatedCost: trip.totalEstimatedCost || '',
    currency: trip.currency,
    currencySymbol: trip.currencySymbol,
    country: trip.country,
    travelTips: trip.travelTips || [],
    itinerary: trip.days?.map((day: any, idx: number) => ({
      day: idx + 1,
      date: new Date(day.date).toLocaleDateString(),
      dailyCost: day.dailyCost || '',
      places: day.places || [],
    })) || [],
    metadata: {
      landingCity: trip.metadata?.landingCity || trip.title,
      tripDays: trip.days?.length || 0,
      month: trip.metadata?.month || new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long' }),
      budget: trip.metadata?.budget || 'Medium',
      groupType: trip.metadata?.groupType || 'Solo',
      interests: trip.metadata?.interests || [],
      generatedAt: trip.createdAt || new Date().toISOString(),
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/trips')}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm sm:text-base">Back to Trips</span>
        </button>

        {/* Editable Itinerary */}
        <ItineraryDisplay
          data={itineraryData}
          tripId={id}
          editable={true}
          onPlaceAdd={handlePlaceAdd}
          onPlaceRemove={handlePlaceRemove}
          onPlaceToggle={handlePlaceToggle}
          onAIModify={handleAIModify}
        />
      </div>
    </div>
  );
}
