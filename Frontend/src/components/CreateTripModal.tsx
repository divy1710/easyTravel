import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createTripWithAI } from '../api/trip';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (itinerary: any) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const INTERESTS = ['Beaches', 'Hills', 'Culture', 'Ayurveda', 'Food', 'Adventure'];

export function CreateTripModal({ isOpen, onClose, onSuccess }: CreateTripModalProps) {
  const [tripDays, setTripDays] = useState(3);
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [landingCity, setLandingCity] = useState('');
  const [budget, setBudget] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [groupType, setGroupType] = useState<'Solo' | 'Couple' | 'Family'>('Solo');
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: createTripWithAI,
    onSuccess: (data) => {
      onSuccess(data);
      onClose();
    },
  });

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (tripDays < 1 || tripDays > 30) errs.tripDays = 'Days must be between 1 and 30';
    if (!landingCity.trim()) errs.landingCity = 'Landing city is required';
    if (landingCity.trim().length < 2) errs.landingCity = 'Enter a valid city name';
    if (interests.length === 0) errs.interests = 'Select at least one interest';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      tripDays,
      month,
      landingCity: landingCity.trim(),
      budget,
      groupType,
      interests,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Plan Your Trip</h2>

        {mutation.isPending && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-blue-700">Generating your itinerary…</p>
          </div>
        )}

        {mutation.isError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {(mutation.error as any)?.response?.data?.error || 'Failed to generate itinerary. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trip Days */}
          <div>
            <label className="block font-medium mb-1">Number of Trip Days</label>
            <input
              type="number"
              min={1}
              max={30}
              value={tripDays}
              onChange={(e) => setTripDays(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
            {errors.tripDays && <p className="text-red-500 text-sm mt-1">{errors.tripDays}</p>}
          </div>

          {/* Month */}
          <div>
            <label className="block font-medium mb-1">Travel Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded p-2"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Landing City */}
          <div>
            <label className="block font-medium mb-1">Landing City</label>
            <input
              type="text"
              value={landingCity}
              onChange={(e) => setLandingCity(e.target.value)}
              placeholder="e.g., Paris, Tokyo, New York"
              className="w-full border rounded p-2"
            />
            {errors.landingCity && <p className="text-red-500 text-sm mt-1">{errors.landingCity}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block font-medium mb-2">Budget</label>
            <div className="flex gap-4">
              {(['Low', 'Medium', 'High'] as const).map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="budget"
                    checked={budget === b}
                    onChange={() => setBudget(b)}
                    className="accent-blue-600"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group Type */}
          <div>
            <label className="block font-medium mb-2">Travel Group</label>
            <div className="flex gap-4">
              {(['Solo', 'Couple', 'Family'] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="groupType"
                    checked={groupType === g}
                    onChange={() => setGroupType(g)}
                    className="accent-blue-600"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block font-medium mb-2">Interests</label>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition ${
                    interests.includes(interest)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="sr-only"
                  />
                  {interest}
                </label>
              ))}
            </div>
            {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {mutation.isPending ? 'Generating…' : 'Generate Itinerary'}
          </button>
        </form>
      </div>
    </div>
  );
}
