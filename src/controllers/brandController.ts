import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import Brand from '../models/brandModel';

export const getBrands = async (req: Request, res: Response) => {
    try {
        // Fetch all brands
        const brands = await Brand.find();
        res.status(200).json({ brands });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const addBrand = async (req: Request, res: Response) => {
    const { brand } = req.body;
    try {
        // Create a new brand
        const newBrand = new Brand({ name: brand });
        await newBrand.save();

        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    }
    catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteBrand = async (req: Request, res: Response) => {
    const { brand } = req.body;

    try {
        const brandDoc = await Brand.findOne({ name: brand });
        if (!brandDoc) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        // Delete the brand
        await Brand.findByIdAndDelete(brandDoc._id);
        const brands = await Brand.find();
        res.status(200).json({ message: 'Brand deleted successfully', brands: brands });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};