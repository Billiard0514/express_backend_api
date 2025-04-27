import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import CarType from '../models/carTypeModel';

export const getCarTypes = async (req: Request, res: Response) => {
    try {
        // Fetch all car types
        const carTypes = await CarType.find();
        res.status(200).json({ carTypes });
    } catch (error) {
        console.error('Error fetching car types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const addCarType = async (req: Request, res: Response) => {
    const { carType } = req.body;
    try {
        // Create a new car type
        const newCarType = new CarType({ name: carType });
        await newCarType.save();

        res.status(201).json({ message: 'Car type created successfully', carType: newCarType });
    }
    catch (error) {
        console.error('Error creating car type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteCarType = async (req: Request, res: Response) => {
    const { carType } = req.body;

    try {
        const carTypeDoc = await CarType.findOne({ name: carType });
        if (!carTypeDoc) {
            return res.status(404).json({ message: 'Car type not found' });
        }
        // Delete the car type
        await CarType.findByIdAndDelete(carTypeDoc._id);
        const carTypes = await CarType.find();
        res.status(200).json({ message: 'Car type deleted successfully', carTypes: carTypes });
    } catch (error) {
        console.error('Error deleting car type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};