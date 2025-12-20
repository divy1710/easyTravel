import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { generateTripWithAI, AITripRequest } from '../../../services/aiTripService';
import { Trip } from '../../../models/Trip';

// POST /api/v1/trips/create
// Generate AI-powered trip itinerary and save to database
export async function createTripWithAI(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { tripDays, month, landingCity, budget, groupType, interests } = req.body;
    const userId = req.user?.id;

    // Build AI request
    const aiRequest: AITripRequest = {
      tripDays,
      month,
      landingCity,
      budget,
      groupType,
      interests,
    };

    // Generate itinerary with AI
    const aiItinerary = await generateTripWithAI(aiRequest);

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + tripDays - 1);

    // Transform AI response to match our Trip schema
    const days = aiItinerary.itinerary.map((day: any) => ({
      date: new Date(startDate.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000),
      places: day.places.map((place: any) => ({
        name: place.name,
        location: {
          type: 'Point',
          coordinates: [0, 0], // Geocoding can be added later
        },
        type: place.travelMode,
        notes: `${place.time} - ${place.duration} | Cost: ${place.cost}\n${place.description || ''}`,
        aiRecommendation: true,
      })),
      notes: `Daily cost: ${day.dailyCost}`,
    }));

    // Save trip to database if user is authenticated
    let savedTrip = null;
    if (userId) {
      savedTrip = await Trip.create({
        user: userId,
        title: `${landingCity} - ${tripDays} Day ${groupType} Trip`,
        startDate,
        endDate,
        days,
      });
    }

    // Return full response
    res.status(201).json({
      success: true,
      trip: savedTrip,
      aiItinerary: {
        ...aiItinerary,
        metadata: {
          landingCity,
          tripDays,
          month,
          budget,
          groupType,
          interests,
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (err: any) {
    console.error('Create trip with AI error:', err.message);
    next(err);
  }
}
