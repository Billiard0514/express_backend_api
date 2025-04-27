import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import Role from '../models/roleModel';
import nodemailer from 'nodemailer';

export const getRoles = async (req: Request, res: Response) => {
    try {
        // Fetch all roles
        const roles = await Role.find();
        res.status(200).json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const addRole = async (req: Request, res: Response) => {
    const { role } = req.body;
    try {
        
        // Create a new role
        const newRole = new Role({ name: role });
        await newRole.save();

        res.status(201).json({ message: 'Role created successfully', role: newRole });
    }
    catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const setRoleToUser = async (req: Request, res: Response) => {
    const { email, role } = req.body;
    try {
        // Ensure the user is authenticated and attached to req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find role id by role name
        const roleDoc = await Role.findOne({ name: role }); 

        if (!roleDoc) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const user = await User.findOneAndUpdate(
            { email: email}, // Use the authenticated user's email
            { role: roleDoc._id }, // Set the role to the user's role field
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newUser = await User.findById(user._id).populate('role'); // Populate the role field
        // Return user details
        res.status(200).json({
            message: 'Set Role to User successfully',
            user: newUser, // Contains user details attached by Passport
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    const { role } = req.body;

    try {
        const roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
            return res.status(404).json({ message: 'Role not found' });
        }
        // Delete the role
        await Role.findByIdAndDelete(roleDoc._id);
        const newRoles = await Role.find();
        res.status(200).json({ message: 'Role deleted successfully', roles: newRoles });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
