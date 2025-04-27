import mongoose, { Schema, Document } from 'mongoose';

export interface ICarType extends Document {
    name: string;
}

const CarTypeSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default mongoose.model<ICarType>('CarType', CarTypeSchema);