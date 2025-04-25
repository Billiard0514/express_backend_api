import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  email: string;
  password: string;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;