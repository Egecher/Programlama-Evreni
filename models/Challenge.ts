import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  category: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  description: string;
  points: number;
  duration: number;
  isWeekly: boolean;
  weekNumber: string;
  type: 'code' | 'quiz';
  options?: string[];
  correctAnswer?: string;
  isFeatured: boolean;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['Kolay', 'Orta', 'Zor'], default: 'Orta' },
    description: { type: String, required: true },
    points: { type: Number, required: true, min: 3 },
    duration: { type: Number, required: true },
    isWeekly: { type: Boolean, default: false },
    weekNumber: { type: String },
    type: { type: String, enum: ['code', 'quiz'], default: 'code' },
    options: { type: [String], default: [] },
    correctAnswer: { type: String },
    isFeatured: { type: Boolean, default: false },
    logo: { type: String, default: '' }
  },
  { timestamps: true }
);

const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
export default Challenge;