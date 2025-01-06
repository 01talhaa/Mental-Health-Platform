import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatarUrl: String,
  userType: {
    type: String,
    enum: ['regular', 'student', 'anonymous', 'therapist'],
    required: true
  },
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

let User;

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

async function getUserModel() {
  if (!User) {
    await connectDB();
    User = mongoose.models.User || mongoose.model('User', UserSchema);
  }
  return User;
}

export default getUserModel;
