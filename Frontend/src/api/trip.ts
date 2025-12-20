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
