import { Request, Response, NextFunction } from 'express';
import { Trip } from '../../../models/Trip';
import { AuthRequest } from '../middlewares/auth';
import axios from 'axios';
import { config } from '../../../config';

// Create a new trip
export async function createTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, startDate, endDate, days } = req.body;
    const userId = req.user.id;
    const trip = await Trip.create({ user: userId, title, startDate, endDate, days });
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

// Get all trips for the authenticated user
export async function getTrips(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const trips = await Trip.find({ user: userId }).sort({ startDate: 1 });
    res.json(trips);
  } catch (err) {
    next(err);
  }
}

// Get a single trip by ID
export async function getTripById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const trip = await Trip.findOne({ _id: req.params.id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Update a trip
export async function updateTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { title, startDate, endDate, days } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { title, startDate, endDate, days },
      { new: true }
    );
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Delete a trip
export async function deleteTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
}

// Add a place to a specific day
export async function addPlace(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { id, dayIndex } = req.params;
    const placeData = req.body;

    const trip = await Trip.findOne({ _id: id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const dayIdx = parseInt(dayIndex);
    if (dayIdx < 0 || dayIdx >= trip.days.length) {
      return res.status(400).json({ error: 'Invalid day index' });
    }

    // Add default coordinates if not provided
    if (!placeData.location || !placeData.location.coordinates) {
      placeData.location = { type: 'Point', coordinates: [0, 0] };
    }

    trip.days[dayIdx].places.push(placeData);
    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Remove a place from a specific day
export async function removePlace(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { id, dayIndex, placeIndex } = req.params;

    const trip = await Trip.findOne({ _id: id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const dayIdx = parseInt(dayIndex);
    const placeIdx = parseInt(placeIndex);

    if (dayIdx < 0 || dayIdx >= trip.days.length) {
      return res.status(400).json({ error: 'Invalid day index' });
    }

    if (placeIdx < 0 || placeIdx >= trip.days[dayIdx].places.length) {
      return res.status(400).json({ error: 'Invalid place index' });
    }

    trip.days[dayIdx].places.splice(placeIdx, 1);
    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Toggle place completion status
export async function togglePlaceCompletion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { id, dayIndex, placeIndex } = req.params;

    const trip = await Trip.findOne({ _id: id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const dayIdx = parseInt(dayIndex);
    const placeIdx = parseInt(placeIndex);

    if (dayIdx < 0 || dayIdx >= trip.days.length) {
      return res.status(400).json({ error: 'Invalid day index' });
    }

    if (placeIdx < 0 || placeIdx >= trip.days[dayIdx].places.length) {
      return res.status(400).json({ error: 'Invalid place index' });
    }

    const place = trip.days[dayIdx].places[placeIdx];
    place.completed = !place.completed;
    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Update a place
export async function updatePlace(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { id, dayIndex, placeIndex } = req.params;
    const placeData = req.body;

    const trip = await Trip.findOne({ _id: id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const dayIdx = parseInt(dayIndex);
    const placeIdx = parseInt(placeIndex);

    if (dayIdx < 0 || dayIdx >= trip.days.length) {
      return res.status(400).json({ error: 'Invalid day index' });
    }

    if (placeIdx < 0 || placeIdx >= trip.days[dayIdx].places.length) {
      return res.status(400).json({ error: 'Invalid place index' });
    }

    // Update place with new data
    Object.assign(trip.days[dayIdx].places[placeIdx], placeData);
    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// Modify trip itinerary using AI with custom prompt
export async function modifyTripWithAI(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const trip = await Trip.findOne({ _id: id, user: userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Build context from current trip
    const tripContext = {
      title: trip.title,
      days: trip.days.map((day: any, idx: number) => ({
        day: idx + 1,
        date: day.date,
        places: day.places.map((place: any) => ({
          name: place.name,
          time: place.time,
          duration: place.duration,
          travelMode: place.travelMode,
          cost: place.cost,
          description: place.description,
          completed: place.completed
        }))
      }))
    };

    const systemPrompt = `You are a travel planning AI assistant. You will receive a current trip itinerary and a user request to modify it.
Your task is to modify the itinerary according to the user's request while maintaining the same structure.
Output ONLY valid JSON with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "name": "Place Name",
          "time": "09:00 AM",
          "duration": "2 hours",
          "travelMode": "Walking",
          "cost": "$50",
          "description": "Brief description",
          "completed": false
        }
      ]
    }
  ]
}`;

    const userPrompt = `Current trip itinerary:
${JSON.stringify(tripContext, null, 2)}

User request: ${prompt}

Please modify the itinerary according to this request. Keep the same number of days unless specifically asked to change. Output only the modified itinerary in JSON format.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${config.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const aiResponse = JSON.parse(response.data.choices[0].message.content.trim());

    // Update trip days with AI modifications
    if (aiResponse.itinerary) {
      trip.days = aiResponse.itinerary.map((day: any, idx: number) => ({
        date: trip.days[idx]?.date || new Date(),
        places: day.places.map((place: any) => ({
          name: place.name,
          location: { type: 'Point', coordinates: [0, 0] },
          time: place.time,
          duration: place.duration,
          travelMode: place.travelMode,
          cost: place.cost,
          description: place.description,
          completed: place.completed || false,
          aiRecommendation: true,
        })),
        notes: trip.days[idx]?.notes || ''
      }));

      await trip.save();
    }

    res.json(trip);
  } catch (err: any) {
    console.error('AI modification error:', err.message);
    next(err);
  }
}
