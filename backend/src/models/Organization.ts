import { Schema, model, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  domains: string[];
  organizers: string[];
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true },
  domains: [{ type: String, required: true }],
  organizers: [{ type: String, required: true, default: [] }]
});

export const Organization = model<IOrganization>('Organization', OrganizationSchema);