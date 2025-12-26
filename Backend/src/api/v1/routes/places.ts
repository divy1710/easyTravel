import { Router } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

interface PlaceSuggestion {
  id: string;
  name: string;
  fullName: string;
  coordinates: [number, number];
  type: string;
}

/**
 * GET /api/v1/places/search?q=query
 * Search for cities/places using OpenStreetMap Nominatim API
 */
router.get('/search', async (req: any, res: any) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Check cache first
    const cacheKey = `osm:${query.toLowerCase()}`;
    const cached = cache.get<PlaceSuggestion[]>(cacheKey);
    if (cached) {
      return res.json({ suggestions: cached });
    }

    // Use OpenStreetMap Nominatim API
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit,
        featuretype: 'city', // Focus on cities
        'accept-language': 'en'
      },
      headers: {
        'User-Agent': 'EasyTravel/1.0' // Required by Nominatim ToS
      },
      timeout: 5000
    });

    const suggestions: PlaceSuggestion[] = response.data.map((place: any) => ({
      id: place.place_id.toString(),
      name: place.address?.city || place.address?.town || place.address?.village || place.name,
      fullName: place.display_name,
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
      type: place.type || 'place'
    }));

    // Cache the results
    cache.set(cacheKey, suggestions);

    res.json({ suggestions });
  } catch (error) {
    console.error('Places search error:', error);
    res.status(500).json({ error: 'Failed to search places' });
  }
});

export default router;
