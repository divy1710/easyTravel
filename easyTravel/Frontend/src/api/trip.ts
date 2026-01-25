import { api } from './client';

export async function getTrips() {
  const res = await api.get('/trips');
  return res.data;
}

export async function getTrip(id: string) {
  const res = await api.get(`/trips/${id}`);
  return res.data;
}

export async function createTrip(data: any) {
  const res = await api.post('/trips', data);
  return res.data;
}

export async function updateTrip(id: string, data: any) {
  const res = await api.put(`/trips/${id}`, data);
  return res.data;
}

export async function deleteTrip(id: string) {
  const res = await api.delete(`/trips/${id}`);
  return res.data;
}

// Create trip with AI-generated itinerary
export interface CreateTripWithAIPayload {
  tripDays: number;
  month: string;
  landingCity: string;
  budget: 'Low' | 'Medium' | 'High';
  groupType: 'Solo' | 'Couple' | 'Family';
  interests: string[];
}

export async function createTripWithAI(payload: CreateTripWithAIPayload) {
  const res = await api.post('/trips/create', payload);
  return res.data;
}

// Place operations
export async function addPlace(tripId: string, dayIndex: number, placeData: any) {
  const res = await api.post(`/trips/${tripId}/days/${dayIndex}/places`, placeData);
  return res.data;
}

export async function removePlace(tripId: string, dayIndex: number, placeIndex: number) {
  const res = await api.delete(`/trips/${tripId}/days/${dayIndex}/places/${placeIndex}`);
  return res.data;
}

export async function togglePlaceCompletion(tripId: string, dayIndex: number, placeIndex: number) {
  const res = await api.patch(`/trips/${tripId}/days/${dayIndex}/places/${placeIndex}/toggle`);
  return res.data;
}

export async function updatePlace(tripId: string, dayIndex: number, placeIndex: number, placeData: any) {
  const res = await api.put(`/trips/${tripId}/days/${dayIndex}/places/${placeIndex}`, placeData);
  return res.data;
}

// Modify trip with AI using custom prompt
export async function modifyTripWithAI(tripId: string, prompt: string) {
  const res = await api.post(`/trips/${tripId}/modify`, { prompt });
  return res.data;
}
