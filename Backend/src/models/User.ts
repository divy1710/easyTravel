import mongoose, { Document, Schema, Types } from 'mongoose';

// --- User Schema ---
// References trips and bookings for relational queries.
export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  googleId?: string;
  avatar?: string;
  trips: Types.ObjectId[];
  bookings: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }], // Reference trips for user
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }], // Reference bookings for user
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
