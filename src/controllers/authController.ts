import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const otpStore: { [key: string]: string } = {}; // In-memory store for OTPs

// Generate a random 4-digit OTP
const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'mykhailokopotiuk@gmail.com',
        pass: process.env.EMAIL_PASS || 'omka jnqg diku imde',
    },
});

// Send OTP to the user's email
const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

// Register with OTP
export const register = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore[email] = otp;

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify OTP and complete registration
export const verifyRegisterOTP = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password, otp } = req.body;

    try {
        // Verify OTP
        if (!otp || otpStore[email] !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

        // Clear OTP from store
        delete otpStore[email];

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login with OTP
export const login = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore[email] = otp;

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email. Please verify to complete login.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify OTP and complete login
export const verifyLoginOTP = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, otp } = req.body;

    try {
        // Verify OTP
        if (!otp || otpStore[email] !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Generate a JWT token
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

        // Clear OTP from store
        delete otpStore[email];

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req: Request, res: Response): Promise<Response | void> => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate and store OTP
        const otp = generateOTP();
        otpStore[email] = otp;

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email. Please verify to reset your password.' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify OTP and Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
    const { email, otp, newPassword } = req.body;

    try {
        // Verify OTP
        if (!otp || otpStore[email] !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clear OTP from store
        delete otpStore[email];

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Profile route
export const profile = (req: Request, res: Response) => {
    try {
        // Ensure the user is authenticated and attached to req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Return user details
        res.status(200).json({
            message: 'This is a protected route',
            user: req.user, // Contains user details attached by Passport
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};