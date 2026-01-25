import axios from 'axios';
import NodeCache from 'node-cache';
import { config } from '../config';

// Cache: 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

export type TravelMode = 'driving' | 'walking' | 'cycling'; // Mapbox does not support public transit in Directions API

interface DirectionsResult {
  duration: number; // seconds
  distance: number; // meters
  mode: TravelMode;
  from: [number, number];
  to: [number, number];
}

export interface PlaceSuggestion {
  id: string;
  name: string;
  fullName: string;
  coordinates: [number, number]; // [lng, lat]
  type: string;
}

/**
 * Search for cities/places using Mapbox Geocoding API
 * @param query Search query string
 * @param limit Max number of results
 */
export async function searchPlaces(
  query: string,
  limit: number = 5
): Promise<PlaceSuggestion[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = cache.get<PlaceSuggestion[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
  
  try {
    const res = await axios.get(url, {
      params: {
        access_token: config.mapboxToken,
        types: 'place,locality,region', // Cities, towns, regions
        limit,
        language: 'en'
      },
      timeout: 5000
    });

    const suggestions: PlaceSuggestion[] = (res.data.features || []).map((feature: any) => ({
      id: feature.id,
      name: feature.text,
      fullName: feature.place_name,
      coordinates: feature.center, // [lng, lat]
      type: feature.place_type?.[0] || 'place'
    }));

    cache.set(cacheKey, suggestions);
    return suggestions;
  } catch (err) {
    console.error('Mapbox geocoding error:', err);
    return [];
  }
}

/**
 * Get travel time and distance between two places using Mapbox Directions API.
 * @param from [lng, lat]
 * @param to [lng, lat]
 * @param mode 'driving' | 'walking' | 'cycling'
 */
export async function getTravelTime(
  from: [number, number],
  to: [number, number],
  mode: TravelMode = 'driving'
): Promise<DirectionsResult | null> {
  const cacheKey = `${mode}:${from.join(',')}:${to.join(',')}`;
  const cached = cache.get<DirectionsResult>(cacheKey);
  if (cached) return cached;

  // Mapbox API endpoint
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${from[0]},${from[1]};${to[0]},${to[1]}`;
  try {
    const res = await axios.get(url, {
      params: {
        access_token: config.mapboxToken,
        alternatives: false,
        geometries: 'geojson',
        overview: 'simplified',
        steps: false
      },
      timeout: 10000
    });
    const route = res.data.routes && res.data.routes[0];
    if (!route) throw new Error('No route found');
    const result: DirectionsResult = {
      duration: route.duration,
      distance: route.distance,
      mode,
      from,
      to
    };
    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    // Fallback: return null (caller should handle gracefully)
    return null;
  }
}
