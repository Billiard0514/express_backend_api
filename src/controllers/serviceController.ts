import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import Service from '../models/serviceModel';

export const getServices = async (req: Request, res: Response) => {
    try {
        // Fetch all services
        const services = await Service.find();
        res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const addService = async (req: Request, res: Response) => {
    const { service } = req.body;
    try {
        
        // Create a new service
        const newService = new Service({ name: service });
        await newService.save();

        res.status(201).json({ message: 'service created successfully', service: newService });
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteService = async (req: Request, res: Response) => {
    const { service } = req.body;

    try {
        const serviceDoc = await Service.findOne({ name: service });
        if (!serviceDoc) {
            return res.status(404).json({ message: 'service not found' });
        }
        // Delete the service
        await Service.findByIdAndDelete(serviceDoc._id);
        const services = await Service.find();
        res.status(200).json({ message: 'service deleted successfully', services: services });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
