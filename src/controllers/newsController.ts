import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import NewsModel from '../models/newsModel';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

export const upload = multer({ storage });

export const getNews = async (req: Request, res: Response) => {
    try {
        // Fetch news with populated author and brand, and order by favourites count in descending order
        const news = await NewsModel.aggregate([
            {
                $addFields: {
                    favouritesCount: { $size: "$favourites" }, // Add a field for the count of favourites
                },
            },
            {
                $sort: { favouritesCount: -1 }, // Sort by favouritesCount in descending order
            },
            {
                $lookup: {
                    from: "users", // Collection name for User
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author", // Unwind the author array
            },
            {
                $lookup: {
                    from: "brands", // Collection name for Brand
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $unwind: "$brand", // Unwind the brand array
            },
        ]);

        res.status(200).json({ news });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addNews = async (req: Request, res: Response) => {
    const { title, content, brand, email } = req.body;

    try {
        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Find the user by email
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new news article
        const newNews = new NewsModel({
            title,
            description: content, // Assuming "content" is the description
            brand,
            author: userDoc._id, // Use userDoc._id instead of req.user._id
            image: req.file.path, // Save the file path of the uploaded image
        });

        // Save the news article to the database
        await newNews.save();

        res.status(201).json({ message: 'News article created successfully', news: newNews });
    } catch (error) {
        console.error('Error creating news article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
