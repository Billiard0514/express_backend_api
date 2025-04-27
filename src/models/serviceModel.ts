import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    name: string;
}

const ServiceSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default mongoose.model<IService>('Service', ServiceSchema);