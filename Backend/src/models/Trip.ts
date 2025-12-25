import mongoose, { Schema, Document, Types } from 'mongoose';

// --- Place Interface ---
export interface IPlace {
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
  type?: string;
  notes?: string;
  aiRecommendation?: boolean;
  completed?: boolean;
  time?: string;
  duration?: string;
  travelMode?: string;
  cost?: string;
  description?: string;
}

// --- Day Interface ---
export interface IDay {
  date: Date;
  places: IPlace[];
  notes?: string;
  dailyCost?: string;
}

// --- Place Schema ---
// Embedded in Day for fast access, as places are unique per trip day and not reused.
const PlaceSchema = new Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  type: { type: String }, // e.g., restaurant, attraction
  notes: { type: String },
  aiRecommendation: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  time: { type: String },
  duration: { type: String },
  travelMode: { type: String },
  cost: { type: String },
  description: { type: String },
}, { _id: false });

// --- Booking Schema ---
// Referenced from Trip for flexibility and to allow updates/cancellations.
export interface IBooking extends Document {
  user: Types.ObjectId;
  trip: Types.ObjectId;
  placeName: string;
  bookingType: string; // hotel, flight, etc.
  details: any;
  date: Date;
}

const BookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  placeName: { type: String, required: true },
  bookingType: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  date: { type: Date, required: true },
}, { timestamps: true });

// --- Day Schema ---
// Embedded in Trip for fast itinerary access.
const DaySchema = new Schema({
  date: { type: Date, required: true },
  places: [PlaceSchema],
  notes: { type: String },
  dailyCost: { type: String },
}, { _id: false });

// --- Trip Schema ---
// References User, embeds Days (with embedded Places), references Bookings.
export interface ITrip extends Document {
  user: Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  days: IDay[];
  bookings: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  destination?: string;
  metadata?: {
    numberOfDays?: number;
    budget?: string;
    travelers?: number;
    preferences?: string[];
  };
  totalEstimatedCost?: string;
  currency?: string;
}

const TripSchema = new Schema<ITrip>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: [DaySchema], // Embedded for fast itinerary reads
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }], // Referenced for flexibility
  destination: { type: String },
  metadata: {
    numberOfDays: { type: Number },
    budget: { type: String },
    travelers: { type: Number },
    preferences: [{ type: String }],
  },
  totalEstimatedCost: { type: String },
  currency: { type: String },
}, { timestamps: true });

TripSchema.index({ user: 1, startDate: 1 }); // For user trip queries

// --- Export Models ---
export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
