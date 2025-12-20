import { Request, Response, NextFunction } from 'express';
import { Trip } from '../../../models/Trip';
import { AuthRequest } from '../middlewares/auth';

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
