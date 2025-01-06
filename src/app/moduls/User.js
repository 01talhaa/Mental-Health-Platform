import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatarUrl: String,
  userType: { type: String, enum: ['regular', 'student', 'anonymous', 'therapist'] },
  studentId: String,
  universityEmail: String,
  anonymousCode: String,
  // Therapist specific fields
  phone: String,
  nidPassport: String,
  certificates: [String],
  experience: String,
  price: Number,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
