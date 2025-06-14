
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const User = model<IUser>('User', UserSchema);