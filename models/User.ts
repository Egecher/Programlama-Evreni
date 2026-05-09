import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  points: number;
  level: string;
  avatar: string;
  completedChallenges: {
    challenge: mongoose.Types.ObjectId;
    startedAt: Date; // Soruya tıkladığı an
    completedAt?: Date;
    timeSpent: number; // Saniye cinsinden harcanan toplam süre
    status: 'Devam Ediyor' | 'Başarılı' | 'Süre Doldu' | 'Hatalı';
    earnedPoints: number;
    submittedAnswer?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    level: { type: String, default: 'Junior' },
    avatar: { type: String, default: '' },
    completedChallenges: [
      {
        challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
        startedAt: { type: Date, required: true },
        completedAt: { type: Date },
        timeSpent: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ['Devam Ediyor', 'Başarılı', 'Süre Doldu', 'Hatalı'],
          default: 'Devam Ediyor'
        },
        earnedPoints: { type: Number, default: 0 },
        submittedAnswer: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;