import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);