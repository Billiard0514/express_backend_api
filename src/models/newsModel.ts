import { Schema, model, Document } from 'mongoose';

interface News extends Document {
    image: string;
    title: string;
    description: string;
    brand: Schema.Types.ObjectId; // Reference to the Brand model
    author: Schema.Types.ObjectId; // Reference to the User model
    favourites: Schema.Types.ObjectId; // Reference to the User model[]; // Array of user IDs or usernames
}

const NewsSchema = new Schema<News>({
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    favourites: { type: [Schema.Types.ObjectId], default: [] },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const NewsModel = model<News>('News', NewsSchema);

export default NewsModel;