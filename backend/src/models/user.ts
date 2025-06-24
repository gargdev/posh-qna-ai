import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId?:      string;
  displayName:    string;
  email:          string;
  password?:      string;      // hashed
  isSubscribed:   boolean;     // paid subscriber
  chatCredits:    number;      // remaining free credits or unlimited if subscribed
}

const UserSchema = new Schema<IUser>({
  googleId:     { type: String, unique: true, sparse: true },
  displayName:  { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String },
  isSubscribed: { type: Boolean, default: false },
  chatCredits:  { type: Number,  default: 0 }
});

export const User = model<IUser>('User', UserSchema);
